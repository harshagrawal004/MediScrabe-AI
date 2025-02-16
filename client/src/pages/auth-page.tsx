import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";
import { Stethoscope, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (data: { username: string; password: string }) => {
    try {
      await loginMutation.mutate(data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={loginForm.handleSubmit(handleSubmit)}
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
                    {...loginForm.register("username", { required: "Username is required" })}
                    className="pl-10 bg-background/60 dark:bg-background/40 backdrop-blur-sm"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
                {loginForm.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...loginForm.register("password", { required: "Password is required" })}
                    className="pl-10 pr-10 bg-background/60 dark:bg-background/40 backdrop-blur-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              {loginMutation.error && (
                <p className="text-sm text-destructive text-center">
                  {loginMutation.error.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full font-semibold py-6 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
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