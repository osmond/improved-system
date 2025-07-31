// src/components/ui/chart-container.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  "aria-label"?: string;
}

export function ChartContainer({
  children,
  className,
  title,
  subtitle,
  ...rest
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "p-4 bg-card rounded-md space-y-4 shadow-sm border border-muted-foreground/10",
        className
      )}
      {...rest}
    >
      {(title || subtitle) && (
        <div>
          <div className="flex flex-col items-center">
            {title && (
              <div className="text-sm font-medium uppercase tracking-wide">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[10px] text-muted-foreground mt-1">
                {subtitle}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
