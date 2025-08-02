import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn, minutesSince } from "@/lib/utils";

export interface ChartCardProps {
  lastSync?: string;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function ChartCard({ title, description, className, children, lastSync }: ChartCardProps) {
  return (
    <Card className={cn("flex h-full flex-col", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {lastSync && (
            <p className="text-xs text-muted-foreground">Last synced {minutesSince(lastSync)} min ago</p>
          )}
        </CardHeader>
        )}
      <CardContent className="flex-1 pt-0">{children}</CardContent>
    </Card>
  );
}

export default ChartCard;
