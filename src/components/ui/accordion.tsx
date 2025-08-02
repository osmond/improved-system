import React from "react";
import { cn } from "@/lib/utils";

type AccordionProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
};

export function Accordion({ value, onValueChange, children }: AccordionProps) {
  return (
    <div data-accordion className="space-y-2">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, {
              accordionValue: value,
              onChange: onValueChange,
            })
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
};

export function AccordionItem({ value, accordionValue, onChange, children }: ItemProps) {
  const open = value === accordionValue;
  return (
    <div data-open={open} className="border rounded">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, {
              open,
              value,
              onToggle: () => onChange?.(value),
            })
          : child
      )}
    </div>
  );
}

type TriggerProps = {
  value?: string;
  open?: boolean;
  onToggle?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function AccordionTrigger({
  value,
  open,
  onToggle,
  className,
  children,
}: TriggerProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const triggers = ref.current
      ?.closest("[data-accordion]")
      ?.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]");
    if (!triggers) return;
    const items = Array.from(triggers);
    const index = items.indexOf(ref.current!);
    let next = index;
    if (e.key === "ArrowDown") next = (index + 1) % items.length;
    else if (e.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    else return;
    e.preventDefault();
    items[next].focus();
  }
  return (
    <button
      ref={ref}
      data-accordion-trigger
      aria-expanded={open}
      aria-controls={value ? `panel-${value}` : undefined}
      className={cn(
        "w-full flex items-center justify-between p-2 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        open && "bg-muted/50",
        className
      )}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      {children}
    </button>
  );
}

type ContentProps = {
  value?: string;
  open?: boolean;
  children: React.ReactNode;
};

export function AccordionContent({ value, open, children }: ContentProps) {
  if (!open) return null;
  return (
    <div
      id={value ? `panel-${value}` : undefined}
      role="region"
      className="p-2 bg-card"
    >
      {children}
    </div>
  );
}
