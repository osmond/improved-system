import React from "react";
import { useLocation } from "react-router-dom";
import TopNavigation from "@/components/layout/TopNavigation";
import CommandPalette from "@/ui/CommandPalette";
import { ChartActionsProvider } from "@/hooks/useChartActions";
import useRecentViews from "@/hooks/useRecentViews";

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
      <div className="flex min-h-screen flex-col">
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
        <main className="flex-1 p-4">{children}</main>
      </div>
    </ChartActionsProvider>
  );
}

