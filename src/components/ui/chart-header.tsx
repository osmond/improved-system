// src/components/ui/chart-header.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ChartHeader({ title, subtitle, className }: ChartHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center text-center space-y-1", className)}>
      {title && (
        <div className="text-sm font-medium uppercase tracking-wide">{title}</div>
      )}
      {subtitle && (
        <div className="text-[10px] text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
}
