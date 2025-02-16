import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertRecordSchema, type InsertRecord } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface ConsultationFormProps {
  onSuccess: (recordId: number) => void;
  onCancel: () => void;
}

export function ConsultationForm({ onSuccess, onCancel }: ConsultationFormProps) {
  const { toast } = useToast();
  const form = useForm<InsertRecord>({
    resolver: zodResolver(insertRecordSchema),
    defaultValues: {
      title: "",
      content: "",
      transcription: "",
      audioUrl: "",
      metadata: {},
    },
  });

  const createRecord = useMutation({
    mutationFn: async (data: InsertRecord) => {
      const res = await apiRequest("POST", "/api/records", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/records"] });
      onSuccess(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating record",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createRecord.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Consultation Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Initial consultation notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createRecord.isPending}
          >
            Start Recording
          </Button>
        </div>
      </form>
    </Form>
  );
}