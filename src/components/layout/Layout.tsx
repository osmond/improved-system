import React from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import AppSidebar from "@/components/app-sidebar";
import CommandPalette from "@/components/ui/CommandPalette";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Command } from "lucide-react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <CommandPalette open={open} setOpen={setOpen} />
      <SidebarInset>
        <header className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                  >
                    <Command className="h-4 w-4" />
                    <span className="sr-only">Open command palette</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ctrl/⌘+K</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
