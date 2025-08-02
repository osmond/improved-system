import React from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import AppSidebar from "@/components/app-sidebar";
import CommandPalette from "@/components/ui/CommandPalette";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <CommandPalette />
      <SidebarInset>
        <header className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
