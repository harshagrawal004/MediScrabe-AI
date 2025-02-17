import { useAuth } from "@/hooks/use-auth";
import { StatsDisplay } from "@/components/stats-display";
import { RecentConsultations } from "@/components/recent-consultations";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Plus, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Consultation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const handleLogout = async () => {
    try {
      await signOut();
      setLocation("/auth");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const userEmail = user?.email?.split('@')[0] || 'Doctor';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Medical Recorder
              </h1>
              <p className="text-sm text-muted-foreground">Welcome, Dr. {userEmail}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button asChild>
                <Link to="/app/record">
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