import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, LockIcon } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative flex items-center justify-center p-8 bg-background/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80 dark:from-background/80 dark:to-background/40" />
        <Card className="w-full max-w-md border-border/40 relative z-10 shadow-xl dark:shadow-purple-500/10 backdrop-blur-xl bg-background/60">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 p-3 mb-2 shadow-inner dark:bg-primary/20">
              <LockIcon className="w-full h-full text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Authentication Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Authentication will be implemented with Supabase.
              Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:flex flex-col justify-center p-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2)_0%,transparent_60%)]" />
        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="p-3 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm">
            <Stethoscope className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Medical Consultation Recorder</h1>
          <p className="text-lg opacity-90">
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