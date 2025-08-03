import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  variant?: string;
}

export function Badge({ className, children, variant = "default" }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "text-foreground border",
  };
  const variantClass = variants[variant] ?? variants["default"];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClass,
        className
      )}
    >
      {children}
    </span>
  );
}
