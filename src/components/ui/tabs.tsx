import * as React from "react";

export function Tabs({
  value,
  onValueChange,
  children
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 mb-4">{children}</div>;
}

export function TabsTrigger({
  value,
  children,
  onClick
}: {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="px-3 py-1 rounded bg-muted hover:bg-muted-foreground"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
