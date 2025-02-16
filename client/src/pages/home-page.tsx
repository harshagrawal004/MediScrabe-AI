import { useAuth } from "@/hooks/use-auth";
import { StatsDisplay } from "@/components/stats-display";
import { RecentConsultations } from "@/components/recent-consultations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Consultation } from "@shared/schema";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Medical Recorder
              </h1>
              <p className="text-sm text-muted-foreground">Welcome, Dr. {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => logoutMutation.mutate()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button asChild>
                <Link to="/record">
                  <Plus className="h-4 w-4 mr-2" />
                  New Recording
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <StatsDisplay consultations={consultations} />
        <RecentConsultations />
      </main>
    </div>
  );
}