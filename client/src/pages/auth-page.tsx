import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";
import { Stethoscope, LockIcon, UserIcon } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();

  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 transition-colors duration-300">
      <div className="relative flex items-center justify-center p-8 bg-background/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        <Card className="w-full max-w-md border-border/40 relative z-10 shadow-xl dark:shadow-purple-500/5">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 p-3 mb-2">
              <LockIcon className="w-full h-full text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
                  <Input
                    id="username"
                    {...loginForm.register("username")}
                    className="pl-10"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register("password")}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full font-semibold py-6"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:flex flex-col justify-center p-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.2)_50%,transparent_75%)] animate-gradient" />
        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <Stethoscope className="h-16 w-16 opacity-90" />
          <h1 className="text-4xl font-bold tracking-tight">Medical Consultation Recorder</h1>
          <p className="text-lg opacity-90">
            Securely record and transcribe your medical consultations with our
            HIPAA-compliant platform.
          </p>
          <ul className="space-y-3 text-lg opacity-75">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Secure audio recording
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Automatic transcription
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Patient management
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              HIPAA compliant
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}