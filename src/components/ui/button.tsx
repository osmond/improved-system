import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50";
const variants: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};
const sizes: Record<string, string> = {
  sm: "h-8 px-3",
  default: "h-10 px-4 py-2",
  lg: "h-11 px-8",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
