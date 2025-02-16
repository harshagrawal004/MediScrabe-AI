import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <div className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                  <img src="/logo.png" alt="MedScribe AI Logo" className="h-12 w-12" />
                  <span className="text-2xl font-bold tracking-tight text-primary">
                    MedScribe AI
                  </span>
                </div>
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Features
                </Link>
                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <Link href="/auth">
                <Button variant="ghost" className="px-6">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-4 pt-20">
          <div className="flex flex-col items-center justify-center text-center space-y-10">
            <div className="animate-float">
              <img 
                src="/logo.png" 
                alt="MedScribe AI Logo" 
                className="h-32 w-32 object-contain"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/90 via-primary to-primary/90">
                  Transform Your Medical Practice
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                AI-powered medical transcription that saves time and improves accuracy.
                HIPAA-compliant, secure, and trusted by healthcare professionals.
              </p>
            </div>

            <div className="pt-8">
              <Link href="/auth">
                <Button 
                  size="lg" 
                  className="px-10 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background effects */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Everything you need to streamline your medical documentation workflow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards here - keeping your existing feature cards */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4">
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
};

export default LandingPage;