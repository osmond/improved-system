import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Map as MapIcon, ChartLine, Settings as SettingsIcon } from "lucide-react";
import {
  chartRouteGroups,
  mapRoutes,
  analyticsRoutes,
  settingsRoutes,
  dashboardRoutes,
} from "@/routes";
import NavSection from "@/components/nav-section";
import { TooltipProvider } from "@/components/ui/tooltip";
import useFavorites from "@/hooks/useFavorites";

export default function AppSidebar() {
  const { pathname } = useLocation();

  const { favorites, toggleFavorite } = useFavorites();

  const allRoutes = React.useMemo(
    () => [
      ...dashboardRoutes.flatMap((g) => g.items),
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
          {settingsRoutes.length > 0 && (
            <NavSection
              label="Settings"
              routes={settingsRoutes}
              icon={SettingsIcon}
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

