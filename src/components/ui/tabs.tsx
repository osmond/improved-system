import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  onValueChange,
  children
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div role="tablist" className="flex gap-2 mb-4">
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  onClick,
}: {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ctx = React.useContext(TabsContext);
  const active = ctx?.value === value;
  const ref = React.useRef<HTMLButtonElement>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const tabs = ref.current
      ?.closest("[role=tablist]")
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    if (!tabs) return;
    const items = Array.from(tabs);
    const index = items.indexOf(ref.current!);
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else return;
    e.preventDefault();
    const target = items[next];
    target.focus();
    const val = target.getAttribute("data-value");
    if (val) ctx?.onValueChange(val);
  }

  return (
    <button
      ref={ref}
      role="tab"
      id={`tab-${value}`}
      data-value={value}
      tabIndex={active ? 0 : -1}
      aria-selected={active}
      aria-controls={`panel-${value}`}
      className={cn(
        "px-3 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted-foreground"
      )}
      onClick={() => {
        ctx?.onValueChange(value);
        onClick?.();
      }}
      onKeyDown={onKeyDown}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      tabIndex={0}
      aria-labelledby={`tab-${value}`}
    >
      {children}
    </div>
  );
}
