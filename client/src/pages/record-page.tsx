import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ConsultationForm } from "@/components/consultation-form";
import { RecordingControls } from "@/components/recording-controls";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

enum RecordingState {
  PATIENT_FORM,
  RECORDING,
}

export default function RecordPage() {
  const [state, setState] = useState(RecordingState.PATIENT_FORM);
  const [patientId, setPatientId] = useState<number | null>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const createConsultation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      if (!patientId || !user) return;

      try {
        // Convert audio blob to base64
        const base64Audio = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data URL prefix
          };
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });

        // Create consultation record in Supabase
        const { data: consultation, error } = await supabase
          .from('consultations')
          .insert({
            patient_id: patientId,
            doctor_id: user.id,
            date: new Date().toISOString(),
            audio_data: base64Audio,
            status: 'processing',
            duration: Math.floor(audioBlob.size / 1000) // Approximate duration
          })
          .select()
          .single();

        if (error) throw error;
        return consultation;
      } catch (error) {
        console.error('Error creating consultation:', error);
        throw new Error('Failed to save consultation. Please try again.');
      }
    },
    onSuccess: (consultation) => {
      if (!consultation) return;

      toast({
        title: "Recording saved",
        description: "Your consultation is being processed...",
      });
      navigate(`/app/results/${consultation.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving recording",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/95 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/app")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-primary">
              {state === RecordingState.PATIENT_FORM
                ? "New Consultation"
                : "Recording Session"}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {state === RecordingState.PATIENT_FORM ? (
          <div className="max-w-md mx-auto">
            <ConsultationForm
              onSuccess={(id) => {
                setPatientId(id);
                setState(RecordingState.RECORDING);
              }}
              onCancel={() => navigate("/app")}
            />
          </div>
        ) : (
          <RecordingControls
            onComplete={(audioBlob) => createConsultation.mutate(audioBlob)}
          />
        )}
      </main>
    </div>
  );
}