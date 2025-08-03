import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInput,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
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
import useRecentViews from "@/hooks/useRecentViews";

export default function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { favorites, toggleFavorite } = useFavorites();
  const { recentViews } = useRecentViews();

  const [query, setQuery] = React.useState("");
  const [highlighted, setHighlighted] = React.useState<string | null>(null);

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

  const recentRoutes = React.useMemo(
    () =>
      recentViews
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as typeof allRoutes,
    [recentViews, allRoutes]
  );

  const filteredFavorites = React.useMemo(
    () =>
      favoriteRoutes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      ),
    [favoriteRoutes, query]
  );

  const filteredRecent = React.useMemo(
    () =>
      recentRoutes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      ),
    [recentRoutes, query]
  );

  const filteredChartGroups = React.useMemo(
    () =>
      chartRouteGroups
        .map((g) => ({
          ...g,
          items: g.items.filter((r) =>
            r.label.toLowerCase().includes(query.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0),
    [query]
  );

  const filteredAnalytics = React.useMemo(
    () =>
      analyticsRoutes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const filteredSettings = React.useMemo(
    () =>
      settingsRoutes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const filteredMaps = React.useMemo(
    () =>
      mapRoutes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  React.useEffect(() => {
    const first = [
      ...filteredFavorites,
      ...filteredRecent,
      ...filteredChartGroups.flatMap((g) => g.items),
      ...filteredAnalytics,
      ...filteredSettings,
      ...filteredMaps,
    ][0];
    setHighlighted(first?.to ?? null);
  }, [
    filteredFavorites,
    filteredRecent,
    filteredChartGroups,
    filteredAnalytics,
    filteredSettings,
    filteredMaps,
  ]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && highlighted) {
      if (e.metaKey || e.ctrlKey) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
          })
        );
      } else {
        navigate(highlighted);
      }
    }
  };

  return (
    <TooltipProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <div className="p-2">
            <SidebarInput
              placeholder="Filter menu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {filteredFavorites.length > 0 && (
            <NavSection
              label="Favorites"
              routes={filteredFavorites}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
          )}
          {filteredRecent.length > 0 && (
            <NavSection
              label="Recent"
              routes={filteredRecent}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
          )}
          {filteredChartGroups.length > 0 && (
            <NavSection
              label="Charts"
              groups={filteredChartGroups}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
          )}
          {filteredAnalytics.length > 0 && (
            <NavSection
              label="Analytics"
              routes={filteredAnalytics}
              icon={ChartLine}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
          )}
          {filteredSettings.length > 0 && (
            <NavSection
              label="Settings"
              routes={filteredSettings}
              icon={SettingsIcon}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
          )}
          {filteredMaps.length > 0 && (
            <NavSection
              label="Maps"
              routes={filteredMaps}
              icon={MapIcon}
              pathname={pathname}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
          )}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </TooltipProvider>
  );
}

