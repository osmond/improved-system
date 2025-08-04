import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/ui/navigation-menu";
import {
  analyticsRoutes,
  chartRouteGroups,
  mapRoutes,
  settingsRoutes,
  dashboardRoutes,
} from "@/routes";
import RouteList from "@/components/navigation/RouteList";
import RouteGroup from "@/components/navigation/RouteGroup";
import FavoritesList from "@/components/navigation/FavoritesList";
import useNavigationFavorites from "@/hooks/useNavigationFavorites";
import useNavigationRecent from "@/hooks/useNavigationRecent";

export default function GlobalNavigation() {
  const location = useLocation();

  const [menuValue, setMenuValue] = React.useState<string | undefined>();
  const closeMenu = React.useCallback(() => setMenuValue(undefined), []);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setMenuValue((prev) => (prev ? undefined : "analytics"));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    closeMenu();
  }, [location.pathname, closeMenu]);

  const insightsRoutes = React.useMemo(
    () => dashboardRoutes.find((g) => g.label === "Privacy")?.items ?? [],
    [dashboardRoutes],
  );

  const allRoutes = React.useMemo(
    () => [
      ...dashboardRoutes.flatMap((g) => g.items),
      ...chartRouteGroups.flatMap((g) => g.items),
    ],
    [dashboardRoutes, chartRouteGroups],
  );

  const { favorites, favoriteRoutes, toggleFavorite } =
    useNavigationFavorites(allRoutes);
  const { recentRoutes } = useNavigationRecent(allRoutes);

  return (
    <NavigationMenu value={menuValue} onValueChange={setMenuValue}>
      <NavigationMenuList>
        <NavigationMenuItem value="analytics">
          <NavigationMenuTrigger data-shortcut="nav-analytics">
            Analytics
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <FavoritesList
              favoriteRoutes={favoriteRoutes}
              recentRoutes={recentRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
            <RouteList
              routes={analyticsRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="charts">
          <NavigationMenuTrigger data-shortcut="nav-charts">
            Charts
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <FavoritesList
              favoriteRoutes={favoriteRoutes}
              recentRoutes={recentRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
            {chartRouteGroups.map((group) => (
              <RouteGroup
                key={group.label}
                label={group.label}
                routes={group.items}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                closeMenu={closeMenu}
              />
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="maps">
          <NavigationMenuTrigger data-shortcut="nav-maps">
            Maps
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <FavoritesList
              favoriteRoutes={favoriteRoutes}
              recentRoutes={recentRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
            <RouteList
              routes={mapRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="insights">
          <NavigationMenuTrigger data-shortcut="nav-insights">
            Insights/Personal
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <FavoritesList
              favoriteRoutes={favoriteRoutes}
              recentRoutes={recentRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
            <RouteList
              routes={insightsRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="settings">
          <NavigationMenuTrigger data-shortcut="nav-settings">
            Settings/Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <FavoritesList
              favoriteRoutes={favoriteRoutes}
              recentRoutes={recentRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
            <RouteList
              routes={settingsRoutes}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              closeMenu={closeMenu}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

