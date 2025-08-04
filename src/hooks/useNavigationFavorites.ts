import * as React from "react";
import type { DashboardRoute } from "@/routes";
import useFavorites from "@/hooks/useFavorites";

export default function useNavigationFavorites(allRoutes: DashboardRoute[]) {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteRoutes = React.useMemo(
    () =>
      favorites
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as DashboardRoute[],
    [favorites, allRoutes],
  );

  return { favorites, favoriteRoutes, toggleFavorite } as const;
}

