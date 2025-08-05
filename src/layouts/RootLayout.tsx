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

  React.useEffect(() => {
    addRecentView(location.pathname);
  }, [location.pathname, addRecentView]);

  return (
    <ChartActionsProvider>
      <CommandPalette />
      <main className="flex-1 p-4">{children}</main>
    </ChartActionsProvider>
  );
}

