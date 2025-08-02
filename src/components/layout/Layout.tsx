import React from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import Sidebar from "./Sidebar";
import CommandPalette from "@/components/ui/CommandPalette";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      <CommandPalette />
      <main className="flex-1 p-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </header>
        <SidebarTrigger />
        <div className="mt-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
