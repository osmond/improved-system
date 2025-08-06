import React from "react";
import { useLocation } from "react-router-dom";
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
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </ChartActionsProvider>
  );
}

