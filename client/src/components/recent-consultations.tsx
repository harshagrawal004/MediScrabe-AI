import { useQuery } from "@tanstack/react-query";
import { Record } from "@shared/schema";
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
  const { data: records = [] } = useQuery<Record[]>({
    queryKey: ["/api/records"],
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Records</h2>
      <div className="rounded-md border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Audio</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {format(new Date(record.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{record.title}</TableCell>
                <TableCell>
                  {record.audioUrl ? (
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
                    <Link to={`/records/${record.id}`}>
                      View Record
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