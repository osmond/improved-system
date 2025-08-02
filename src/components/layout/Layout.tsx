import React from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import Sidebar from "./Sidebar";
import CommandPalette from "@/components/ui/CommandPalette";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <CommandPalette />
      <div className="flex-1 p-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </header>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
