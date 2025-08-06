import React from "react";
import { useLocation } from "react-router-dom";
import TopNavigation from "@/components/layout/TopNavigation";
import NavItems from "@/components/layout/NavItems";
import CommandPalette from "@/ui/CommandPalette";
import { ChartActionsProvider } from "@/hooks/useChartActions";
import useRecentViews from "@/hooks/useRecentViews";
import { dashboardRoutes } from "@/routes";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const location = useLocation();
  const { addRecentView } = useRecentViews();
  const [commandOpen, setCommandOpen] = React.useState(false);

  React.useEffect(() => {
    addRecentView(location.pathname);
  }, [location.pathname, addRecentView]);

  return (
    <ChartActionsProvider>
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-shrink-0 border-r bg-sidebar p-4 md:block">
          <NavItems groups={dashboardRoutes} orientation="vertical" className="h-full" />
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex items-center border-b bg-white/80 p-4 backdrop-blur">
            <TopNavigation />
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="rounded-md border px-2 py-1 text-sm"
                aria-label="Open command palette"
              >
                Search
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </ChartActionsProvider>
  );
}

