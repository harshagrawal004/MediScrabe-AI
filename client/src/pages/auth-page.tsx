import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, LockIcon, EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Clear form on mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation("/app");
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative flex items-center justify-center p-8 bg-background/95 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-20"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80 dark:from-background/80 dark:to-background/40" />
        <Card className="w-full max-w-md border-border/40 relative z-10 shadow-xl dark:shadow-purple-500/10 backdrop-blur-xl bg-background/60">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 p-3 mb-4 shadow-inner dark:bg-primary/20 transform hover:scale-105 transition-transform">
              <LockIcon className="w-full h-full text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={authLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    disabled={authLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    disabled={authLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold" 
                disabled={authLoading}
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:flex flex-col justify-center p-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2)_0%,transparent_60%)]" />
        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="p-4 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-transform">
            <Stethoscope className="w-full h-full" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Medical Consultation Recorder</h1>
          <p className="text-xl opacity-90">
            Securely record and transcribe your medical consultations with our
            HIPAA-compliant platform.
          </p>
          <ul className="space-y-4 text-lg">
            {["Secure audio recording", "Automatic transcription", "Patient management", "HIPAA compliant"].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-current opacity-70" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}