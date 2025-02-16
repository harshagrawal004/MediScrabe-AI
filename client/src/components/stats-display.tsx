import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Consultation } from "@shared/schema";
import { Clock, Users, FileAudio, CheckCircle } from "lucide-react";

interface StatsDisplayProps {
  consultations: Consultation[];
}

export function StatsDisplay({ consultations }: StatsDisplayProps) {
  const thisMonth = new Date().getMonth();
  const thisMonthConsultations = consultations.filter(
    (c) => new Date(c.date).getMonth() === thisMonth
  );

  const totalMinutes = consultations.reduce(
    (acc, c) => acc + (c.duration || 0),
    0
  );

  const pendingTranscriptions = consultations.filter(
    (c) => c.audioUrl && !c.transcription
  ).length;

  const completedConsultations = consultations.filter(
    (c) => c.status === "completed"
  ).length;

  const stats = [
    {
      title: "Consultations this Month",
      value: thisMonthConsultations.length,
      icon: Users,
    },
    {
      title: "Total Recording Minutes",
      value: Math.round(totalMinutes / 60),
      icon: Clock,
    },
    {
      title: "Pending Transcriptions",
      value: pendingTranscriptions,
      icon: FileAudio,
    },
    {
      title: "Completed Consultations",
      value: completedConsultations,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}