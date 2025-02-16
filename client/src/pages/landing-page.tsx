import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <span className="text-xl font-bold">MediRecord</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="#features">Features</Link>
              <Link href="#about">About</Link>
              <Link href="#contact">Contact</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="default">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-[900px] mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              The Optimal AI Assistant for Healthcare
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Enterprise-grade clinical documentation solutions, trusted by clinicians across specialties.
            </p>
            <div className="pt-4">
              <Link href="/auth">
                <Button size="lg" className="font-semibold px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border shadow-sm">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7 text-primary"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Recording</h3>
              <p className="text-muted-foreground">
                HIPAA-compliant audio recording and storage for all your medical consultations
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border shadow-sm">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7 text-primary"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Transcription</h3>
              <p className="text-muted-foreground">
                Accurate, AI-powered transcription with medical terminology support
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border shadow-sm">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7 text-primary"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="M3.3 7 12 12l8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly integrates with your existing medical records system
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}