import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import RecordPage from "@/pages/record-page";
import ResultsPage from "@/pages/results-page";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import { ThemeProvider } from "./components/theme-provider"
import { ThemeToggle } from "./components/theme-toggle"

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/app" component={HomePage} />
      <ProtectedRoute path="/app/record" component={RecordPage} />
      <ProtectedRoute path="/app/results/:id" component={ResultsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
            <Router />
            <ThemeToggle className="fixed bottom-4 right-4" />
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;