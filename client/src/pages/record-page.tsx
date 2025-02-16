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

      try {
        // First create the consultation
        const consultationRes = await apiRequest("POST", "/api/consultations", {
          patientId,
          doctorId: user.id,
        });
        const consultation = await consultationRes.json();

        // Compress and convert audio blob to base64
        const compressedBlob = await new Promise<Blob>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Create a new compressed audio blob
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const arrayBuffer = reader.result as ArrayBuffer;
            audioContext.decodeAudioData(arrayBuffer, (buffer) => {
              // Create a lower quality offline context (mono, 16kHz)
              const offlineContext = new OfflineAudioContext(
                1, // mono
                Math.floor(buffer.length * 16000 / buffer.sampleRate), // resample to 16kHz
                16000 // 16kHz sample rate
              );

              const source = offlineContext.createBufferSource();
              source.buffer = buffer;

              // Add compression
              const compressor = offlineContext.createDynamicsCompressor();
              compressor.threshold.value = -50;
              compressor.knee.value = 40;
              compressor.ratio.value = 12;
              compressor.attack.value = 0;
              compressor.release.value = 0.25;

              source.connect(compressor);
              compressor.connect(offlineContext.destination);

              source.start();
              offlineContext.startRendering().then((renderedBuffer) => {
                const wavBlob = bufferToWav(renderedBuffer);
                resolve(wavBlob);
              }).catch(reject);
            }, reject);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(audioBlob);
        });

        // Convert compressed blob to base64
        const base64Audio = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1]; // Remove data URL prefix

            // Check size before sending
            const sizeInMB = (base64Data.length * 0.75) / (1024 * 1024); // Convert base64 length to MB
            if (sizeInMB > 45) { // Allow some buffer from the 50MB limit
              reject(new Error('Recording is too large. Please try a shorter recording or lower quality.'));
              return;
            }

            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(compressedBlob);
        });

        // Send audio file and metadata to server
        await apiRequest("PATCH", `/api/consultations/${consultation.id}`, {
          audioData: base64Audio,
          duration: Math.floor(compressedBlob.size / 2000), // More accurate duration estimate
          status: "processing",
        });

        return consultation;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('413')) {
            throw new Error('The recording is too large. Please try a shorter recording.');
          } else if (error.message.includes('too large')) {
            throw error; // Propagate our custom size error
          }
        }
        throw new Error('Failed to save recording. Please try again.');
      }
    },
    onSuccess: (consultation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      toast({
        title: "Recording saved",
        description: "Your consultation is being processed...",
      });
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

  // Helper function to convert AudioBuffer to WAV blob
  function bufferToWav(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const view = new DataView(new ArrayBuffer(44 + length));

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Write audio data
    const data = new Float32Array(buffer.length * numOfChan);
    let offset = 44;
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const channel = buffer.getChannelData(i);
      for (let j = 0; j < channel.length; j++) {
        const sample = Math.max(-1, Math.min(1, channel[j]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
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