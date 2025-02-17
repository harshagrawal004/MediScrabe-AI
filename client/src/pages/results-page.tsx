import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Consultation } from "@shared/schema";
import { ArrowLeft, Download, FileAudio, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function ResultsPage() {
  const [, params] = useRoute("/results/:id");
  const consultationId = params?.id;

  const { data: consultation, isLoading } = useQuery<Consultation>({
    queryKey: ["/api/consultations", consultationId],
    enabled: !!consultationId,
    refetchInterval: (data: Consultation | undefined) =>
      data?.status === "processing" ? 5000 : false, // Poll every 5s while processing
  });

  if (isLoading || !consultation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const transcription = consultation.transcription;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/95 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/app">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">
              Consultation Results
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Date</div>
                <div>{consultation.date ? format(new Date(consultation.date), "PPP") : "-"}</div>
                <div className="text-sm text-muted-foreground">Patient ID</div>
                <div>{consultation.patientId}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div>
                  {consultation.duration
                    ? `${Math.floor(consultation.duration / 60)}:${(
                        consultation.duration % 60
                      )
                        .toString()
                        .padStart(2, "0")}`
                    : "-"}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="capitalize">
                  {consultation.status === "processing" ? (
                    <span className="flex items-center">
                      Processing
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    </span>
                  ) : (
                    consultation.status
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {consultation.status === "completed" && transcription && (
            <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-border/40">
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcription.summary && (
                  <p className="text-sm text-muted-foreground">{transcription.summary}</p>
                )}
                {transcription.keyPoints && (
                  <div>
                    <h4 className="font-medium mb-2">Key Points</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {transcription.keyPoints.map((point: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {consultation.status === "completed" && transcription?.text && (
          <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Full Transcription</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">
                {transcription.text}
              </pre>
            </CardContent>
          </Card>
        )}

        {consultation.status === "completed" && (
          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <FileAudio className="h-4 w-4 mr-2" />
              Download Audio
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}