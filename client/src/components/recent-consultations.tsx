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
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={consultation.id}>
              <TableCell>
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
                >
                  {consultation.status}
                </Badge>
              </TableCell>
              <TableCell>
                {consultation.duration
                  ? `${Math.round(consultation.duration / 60)}m ${
                      consultation.duration % 60
                    }s`
                  : "-"}
              </TableCell>
              <TableCell>
                {consultation.audioUrl ? (
                  <FileAudio className="h-4 w-4 text-green-500" />
                ) : (
                  <FileAudio className="h-4 w-4 text-gray-300" />
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
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
  );
}
