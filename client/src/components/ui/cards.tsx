import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
  return (
    <Card className={cn("p-6 transition-all hover:shadow-lg", className)}>
      <div className="flex flex-col items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

interface BenefitCardProps {
  title: string;
  description: string;
  className?: string;
}

export function BenefitCard({ title, description, className }: BenefitCardProps) {
  return (
    <Card className={cn("p-6 transition-all hover:shadow-lg", className)}>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
