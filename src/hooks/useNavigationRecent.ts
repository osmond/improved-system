import * as React from "react";
import type { DashboardRoute } from "@/routes";
import useRecentViews from "@/hooks/useRecentViews";

export default function useNavigationRecent(allRoutes: DashboardRoute[]) {
  const { recentViews } = useRecentViews();

  const recentRoutes = React.useMemo(
    () =>
      recentViews
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as DashboardRoute[],
    [recentViews, allRoutes],
  );

  return { recentRoutes } as const;
}

