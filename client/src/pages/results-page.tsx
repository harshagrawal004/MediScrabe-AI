import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Consultation } from "@shared/schema";
import { ArrowLeft, Download, FileAudio, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function ResultsPage() {
  const [, params] = useRoute("/results/:id");
  const consultationId = params?.id;

  const { data: consultation, isLoading } = useQuery<Consultation>({
    queryKey: ["/api/consultations", consultationId],
    enabled: !!consultationId,
    refetchInterval: (data) => 
      data?.status === "processing" ? 5000 : false, // Poll every 5s while processing
  });

  if (isLoading || !consultation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const transcription = consultation.transcription as any;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-[#2C4ECF]">
              Consultation Results
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Date</div>
                <div>{consultation.date ? format(new Date(Number(consultation.date)), "PPP") : "-"}</div>
                <div className="text-sm text-gray-500">Patient ID</div>
                <div>{consultation.patientId}</div>
                <div className="text-sm text-gray-500">Duration</div>
                <div>
                  {consultation.duration
                    ? `${Math.floor(consultation.duration / 60)}:${(
                        consultation.duration % 60
                      )
                        .toString()
                        .padStart(2, "0")}`
                    : "-"}
                </div>
                <div className="text-sm text-gray-500">Status</div>
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
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcription.summary && (
                  <p className="text-sm text-gray-600">{transcription.summary}</p>
                )}
                {transcription.keyPoints && (
                  <div>
                    <h4 className="font-medium mb-2">Key Points</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {transcription.keyPoints.map((point: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600">
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
          <Card>
            <CardHeader>
              <CardTitle>Full Transcription</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 font-mono">
                {transcription.text}
              </pre>
            </CardContent>
          </Card>
        )}

        {consultation.status === "completed" && (
          <div className="flex justify-end space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <FileAudio className="h-4 w-4 mr-2" />
              Download Audio
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}