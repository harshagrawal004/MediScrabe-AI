import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Pause, Play, Square, Save } from "lucide-react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useState } from "react";

interface RecordingControlsProps {
  onComplete: (audioBlob: Blob) => void;
}

export function RecordingControls({ onComplete }: RecordingControlsProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder();

  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level changes
  useState(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-center">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="rounded-full w-20 h-20"
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic className="h-8 w-8" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Recording Level</span>
            <span>{formatDuration(duration)}</span>
          </div>
          <Progress value={audioLevel} className="h-2" />
        </div>

        <div className="flex justify-center space-x-2">
          {isRecording && (
            <>
              <Button
                variant="outline"
                onClick={isPaused ? resumeRecording : pauseRecording}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={stopRecording}>
                <Square className="h-4 w-4" />
              </Button>
            </>
          )}
          {audioBlob && (
            <Button onClick={() => onComplete(audioBlob)}>
              <Save className="h-4 w-4 mr-2" />
              Save Recording
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            <span>{isRecording ? (isPaused ? "Paused" : "Recording") : "Ready"}</span>
          </div>
          <span>WAV - 48kHz</span>
        </div>
      </CardContent>
    </Card>
  );
}
