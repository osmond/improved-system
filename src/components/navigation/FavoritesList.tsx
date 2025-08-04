import * as React from "react";
import type { DashboardRoute } from "@/routes";
import RouteGroup from "./RouteGroup";

interface FavoritesListProps {
  favoriteRoutes: DashboardRoute[];
  recentRoutes: DashboardRoute[];
  favorites: string[];
  toggleFavorite: (to: string) => void;
  closeMenu?: () => void;
}

export default function FavoritesList({
  favoriteRoutes,
  recentRoutes,
  favorites,
  toggleFavorite,
  closeMenu,
}: FavoritesListProps) {
  return (
    <>
      {favoriteRoutes.length > 0 && (
        <RouteGroup
          label="Favorites"
          routes={favoriteRoutes}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          closeMenu={closeMenu}
        />
      )}
      {recentRoutes.length > 0 && (
        <RouteGroup
          label="Recent"
          routes={recentRoutes}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          closeMenu={closeMenu}
        />
      )}
    </>
  );
}

