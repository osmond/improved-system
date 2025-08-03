import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Map as MapIcon, ChartLine } from "lucide-react";
import { chartRouteGroups, mapRoutes, analyticsRoutes } from "@/routes";
import NavSection from "@/components/nav-section";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppSidebar() {
  const { pathname } = useLocation();

  const FAVORITES_KEY = "favorites";
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (to: string) => {
    setFavorites((prev) => {
      const next = prev.includes(to)
        ? prev.filter((r) => r !== to)
        : [...prev, to];
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  const allRoutes = React.useMemo(
    () => [
      ...mapRoutes,
      ...analyticsRoutes,
      ...chartRouteGroups.flatMap((g) => g.items),
    ],
    []
  );

  const favoriteRoutes = React.useMemo(
    () =>
      favorites
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as typeof allRoutes,
    [favorites, allRoutes]
  );

  return (
    <TooltipProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          {favoriteRoutes.length > 0 && (
            <NavSection
              label="Favorites"
              routes={favoriteRoutes}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          {chartRouteGroups.length > 0 && (
            <NavSection
              label="Charts"
              groups={chartRouteGroups}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          {analyticsRoutes.length > 0 && (
            <NavSection
              label="Analytics"
              routes={analyticsRoutes}
              icon={ChartLine}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          {mapRoutes.length > 0 && (
            <NavSection
              label="Maps"
              routes={mapRoutes}
              icon={MapIcon}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </TooltipProvider>
  );
}

