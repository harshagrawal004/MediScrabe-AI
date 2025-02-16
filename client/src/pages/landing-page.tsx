import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FeatureCard, BenefitCard } from "@/components/ui/cards";
import { Mic, Shield, Clock, Brain, Cloud, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <div className="animate-float mb-8">
              <img 
                src="/logo.png" 
                alt="MedScribe AI Logo" 
                className="mx-auto h-28 w-28 md:h-32 md:w-32"
              />
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/90 via-primary to-primary/90">
                MedScribe AI
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              AI-powered medical transcription that saves time and improves accuracy.
              Secure, HIPAA-compliant, and trusted by healthcare professionals.
            </p>
            <Link href="/auth">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                Start Using MedScribe AI
              </Button>
            </Link>
          </div>
        </div>
        {/* Background Effects */}
        <div className="absolute -z-10 inset-0 overflow-hidden">
          <div className="absolute top-1/4 -translate-y-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/4 -translate-y-1/2 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Everything you need to streamline your medical documentation workflow
            </p>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Mic}
              title="Advanced Voice Recognition"
              description="State-of-the-art voice recognition technology specifically trained for medical terminology."
            />
            <FeatureCard
              icon={Shield}
              title="HIPAA Compliant"
              description="Secure infrastructure and protocols that meet all healthcare privacy requirements."
            />
            <FeatureCard
              icon={Clock}
              title="Real-time Processing"
              description="Instant transcription and analysis of medical consultations as they happen."
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Analysis"
              description="Smart analysis of medical terminology and context for improved accuracy."
            />
            <FeatureCard
              icon={Cloud}
              title="Cloud Storage"
              description="Secure cloud storage with easy access to all your medical records."
            />
            <FeatureCard
              icon={Lock}
              title="End-to-End Encryption"
              description="Military-grade encryption for all your sensitive medical data."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 md:py-16 bg-background">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose MedScribe AI</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Experience the benefits of AI-powered medical transcription
            </p>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            <BenefitCard
              title="Save Valuable Time"
              description="Reduce documentation time by up to 60% with automated transcription and analysis."
            />
            <BenefitCard
              title="Improve Patient Care"
              description="Focus more on your patients and less on administrative tasks."
            />
            <BenefitCard
              title="Reduce Errors"
              description="AI-powered accuracy checks help prevent common documentation mistakes."
            />
            <BenefitCard
              title="Easy Integration"
              description="Seamlessly integrates with your existing medical software and workflows."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Get Started Today</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto mb-6">
              Join thousands of healthcare professionals already using MedScribe AI
            </p>
            <Link href="/auth">
              <Button size="lg" className="px-8">
                Start Your Journey
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-center space-y-3">
            <p className="text-muted-foreground">Questions? Contact our support team</p>
            <p className="text-lg">contact@medscribeai.com</p>
            <p className="text-lg">(555) 123-4567</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;