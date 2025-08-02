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
  children,
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
  return <div className="flex gap-2 mb-4">{children}</div>;
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
  return (
    <button
      className={cn(
        "px-3 py-1 rounded",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted-foreground",
      )}
      onClick={() => {
        ctx?.onValueChange(value);
        onClick?.();
      }}
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
  return <div>{children}</div>;
}

