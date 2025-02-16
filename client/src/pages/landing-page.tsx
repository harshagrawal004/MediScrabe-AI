
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="MedScribe AI Logo" className="h-8 w-8" />
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                  MedScribe AI
                </span>
              </div>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="container relative z-10">
          <div className="max-w-[900px] mx-auto text-center space-y-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <img src="/logo.png" alt="MedScribe AI Logo" className="h-20 w-20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary">
                Transform Your Medical Practice
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              AI-powered medical transcription that saves time and improves accuracy.
              HIPAA-compliant, secure, and trusted by healthcare professionals.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/auth">
                <Button size="lg" className="font-semibold px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Everything you need to streamline your medical documentation workflow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-all duration-300">
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
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-all duration-300">
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
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background hover:shadow-lg transition-all duration-300">
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

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Contact Us</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Get in touch with us for any questions about MedScribe AI
            </p>
          </div>
          <div className="max-w-lg mx-auto text-center space-y-4">
            <p className="text-lg">Email: contact@medscribeai.com</p>
            <p className="text-lg">Phone: (555) 123-4567</p>
            <p className="text-lg">Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</p>
          </div>
        </div>
      </section>
    </div>
  );
}
