import { useQuery } from "@tanstack/react-query";
import { Consultation } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "wouter";
import { FileAudio, Clock, Loader2 } from "lucide-react";

export function RecentConsultations() {
  const { data: consultations = [], isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Consultations</h2>
        <div className="rounded-md border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-8 text-center">
          <p className="text-muted-foreground">No consultations recorded yet.</p>
          <Button asChild className="mt-4">
            <Link to="/app/record">Record Your First Consultation</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Consultations</h2>
      <div className="rounded-md border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation) => (
              <TableRow key={consultation.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {consultation.date ? format(new Date(consultation.date), "MMM d, yyyy") : "-"}
                </TableCell>
                <TableCell>{consultation.patientId}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {consultation.duration
                    ? `${Math.floor(consultation.duration / 60)}:${(
                        consultation.duration % 60
                      )
                        .toString()
                        .padStart(2, "0")}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {consultation.status === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : consultation.status === "completed" ? (
                      <>
                        <FileAudio className="h-4 w-4 text-green-500" />
                        Completed
                      </>
                    ) : (
                      <>
                        <FileAudio className="h-4 w-4 text-muted-foreground" />
                        {consultation.status}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-background/80"
                  >
                    <Link to={`/app/results/${consultation.id}`}>
                      View Details
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