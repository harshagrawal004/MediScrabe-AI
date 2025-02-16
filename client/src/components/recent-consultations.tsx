import { useQuery } from "@tanstack/react-query";
import { Consultation, Patient } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "wouter";
import { FileAudio, FileText } from "lucide-react";

export function RecentConsultations() {
  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Consultations</h2>
      <div className="rounded-md border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Recording</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation) => (
              <TableRow key={consultation.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {format(new Date(consultation.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{consultation.patientId}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      consultation.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50"
                  >
                    {consultation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {consultation.duration
                    ? `${Math.floor(consultation.duration / 60)}:${(
                        consultation.duration % 60
                      )
                        .toString()
                        .padStart(2, "0")}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {consultation.audioUrl ? (
                    <FileAudio className="h-4 w-4 text-green-500" />
                  ) : (
                    <FileAudio className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-background/80"
                  >
                    <Link to={`/results/${consultation.id}`}>
                      View Results
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}