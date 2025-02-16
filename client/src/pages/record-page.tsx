import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ConsultationForm } from "@/components/consultation-form";
import { RecordingControls } from "@/components/recording-controls";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      // First create the consultation
      const consultationRes = await apiRequest("POST", "/api/consultations", {
        patientId,
        doctorId: user.id,
      });
      const consultation = await consultationRes.json();

      // Then upload the audio file
      const formData = new FormData();
      formData.append("audio", audioBlob);
      await apiRequest("PATCH", `/api/consultations/${consultation.id}`, {
        audioUrl: "dummy-url", // In a real app, we'd upload to storage
        duration: Math.floor(audioBlob.size / 16000), // Rough estimate
        status: "processing",
      });

      return consultation;
    },
    onSuccess: (consultation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      navigate(`/results/${consultation.id}`);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-[#2C4ECF]">
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
              onCancel={() => navigate("/")}
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
