import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const ChartHeader = React.forwardRef<HTMLDivElement, ChartHeaderProps>(
  ({ title, subtitle, className, ...props }, ref) => {
    if (!title && !subtitle) return null;
    return (
      <div
        ref={ref}
        className={cn("text-center space-y-0.5", className)}
        {...props}
      >
        {title && (
          <h3 className="text-sm font-medium tracking-wide uppercase">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    );
  }
);
ChartHeader.displayName = "ChartHeader";

