import React from "react";
import { cn } from "@/lib/utils";

type AccordionProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
};

export function Accordion({ value, onValueChange, children }: AccordionProps) {
  return (
    <div className="space-y-2">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { accordionValue: value, onChange: onValueChange })
          : child
      )}
    </div>
  );
}

type ItemProps = {
  value: string;
  accordionValue?: string;
  onChange?: (v: string) => void;
  children: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

export function AccordionItem({ value, accordionValue, onChange, children, onMouseEnter, onMouseLeave, className }: ItemProps) {
  const open = value === accordionValue;
  return (
    <div
      data-open={open}
      className={cn("border rounded", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { open, onToggle: () => onChange?.(value) })
          : child
      )}
    </div>
  );
}

type TriggerProps = {
  open?: boolean;
  onToggle?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function AccordionTrigger({ open, onToggle, className, children }: TriggerProps) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between p-2 bg-muted",
        open && "bg-muted/50",
        className
      )}
      onClick={onToggle}
    >
      {children}
    </button>
  );
}

type ContentProps = {
  open?: boolean;
  children: React.ReactNode;
};

export function AccordionContent({ open, children }: ContentProps) {
  if (!open) return null;
  return <div className="p-2 bg-card">{children}</div>;
}
