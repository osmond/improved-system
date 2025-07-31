import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function ChartCard({ title, description, className, children }: ChartCardProps) {
  return (
    <Card className={cn(className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

export default ChartCard;
