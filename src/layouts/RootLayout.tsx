import React from "react";
import { Link, useLocation } from "react-router-dom";
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

  const isDashboard = location.pathname.startsWith("/dashboard");

  React.useEffect(() => {
    addRecentView(location.pathname);
  }, [location.pathname, addRecentView]);

  return (
    <ChartActionsProvider>
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
      {!isDashboard && (
        <header className="flex items-center justify-between border-b p-4">
          <Link to="/dashboard" className="font-semibold">
            Home
          </Link>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="rounded-md border px-2 py-1 text-sm"
            aria-label="Open command palette"
          >
            Search
          </button>
        </header>
      )}
      <main className="flex-1 p-4">{children}</main>
    </ChartActionsProvider>
  );
}

