import React from "react";
import { Link, useLocation } from "react-router-dom";
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

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (!segments.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex overflow-hidden">
      <ol className="flex items-center text-sm text-muted-foreground">
        {segments.map((segment, idx) => {
          const path = "/" + segments.slice(0, idx + 1).join("/");
          const label = decodeURIComponent(segment)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const isLast = idx === segments.length - 1;
          return (
            <li key={path} className="inline-flex items-center">
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {label}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:underline focus:outline-none focus:underline"
                >
                  {label}
                </Link>
              )}
              {!isLast && <span className="px-2">&gt;</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <CommandPalette open={open} setOpen={setOpen} />
      <SidebarInset>
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumbs />
          </div>
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
