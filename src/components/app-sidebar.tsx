import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";
import {
  chartRouteGroups,
  settingsRoutes,
  dashboardRoutes,
} from "@/routes";
import NavSection from "@/components/nav-section";
import { TooltipProvider } from "@/components/ui/tooltip";
import useFavorites from "@/hooks/useFavorites";

interface AppSidebarProps {
  activeCategory: string;
}

export default function AppSidebar({ activeCategory }: AppSidebarProps) {
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

  const dashboardGroups = React.useMemo(
    () => dashboardRoutes.filter((g) => g.label !== "Settings"),
    []
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
          {activeCategory === "dashboard" && dashboardGroups.length > 0 && (
            <NavSection
              label="Dashboard"
              groups={dashboardGroups}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          {activeCategory === "charts" && chartRouteGroups.length > 0 && (
            <NavSection
              label="Charts"
              groups={chartRouteGroups}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          {activeCategory === "settings" && settingsRoutes.length > 0 && (
            <NavSection
              label="Settings"
              routes={settingsRoutes}
              icon={SettingsIcon}
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

