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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Extended schema with gender and age
const patientSchema = z.object({
  name: z.string().min(2, "Patient name is required"),
  identifier: z.string().min(1, "Patient identifier is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  age: z.number().min(0).max(150, "Age must be between 0 and 150"),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface ConsultationFormProps {
  onSuccess: (patientId: number) => void;
  onCancel: () => void;
}

export function ConsultationForm({ onSuccess, onCancel }: ConsultationFormProps) {
  const { toast } = useToast();
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      identifier: "",
      gender: "other",
      age: undefined,
    },
  });

  const createPatient = useMutation({
    mutationFn: async (data: PatientFormData) => {
      const { data: patient, error } = await supabase
        .from('patients')
        .insert({
          name: data.name,
          identifier: data.identifier,
          gender: data.gender,
          age: data.age,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return patient;
    },
    onSuccess: (data) => {
      onSuccess(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating patient record",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createPatient.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter patient's full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter medical record number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  placeholder="Enter patient's age"
                  min={0}
                  max={150}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createPatient.isPending}
          >
            {createPatient.isPending ? "Creating..." : "Start Recording"}
          </Button>
        </div>
      </form>
    </Form>
  );
}