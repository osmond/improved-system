import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { FragilityPreviewSparkline } from "@/components/dashboard";
import {
  analyticsRoutes,
  chartRouteGroups,
  mapRoutes,
  settingsRoutes,
  dashboardRoutes,
  type DashboardRoute,
} from "@/routes";
import useFavorites from "@/hooks/useFavorites";
import useRecentViews from "@/hooks/useRecentViews";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function RouteList({
  routes,
  favorites,
  toggleFavorite,
  closeMenu,
}: {
  routes: DashboardRoute[];
  favorites: string[];
  toggleFavorite: (to: string) => void;
  closeMenu?: () => void;
}) {
  return (
    <ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
      {routes.map((route) => (
        <li key={route.to}>
          {route.preview === 'fragility' ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <NavigationMenuLink asChild>
                  <Link
                    to={route.to}
                    className="flex rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                    data-shortcut={route.to}
                    onClick={closeMenu}
                  >
                    <route.icon className="mr-2 h-5 w-5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-none flex items-center gap-2">
                        {route.label}
                        {route.badge && (
                          <Badge variant={route.badge}>{route.badge}</Badge>
                        )}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {route.description}
                      </p>
                    </div>
                    <Star
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0",
                        favorites.includes(route.to)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(route.to);
                      }}
                    />
                  </Link>
                </NavigationMenuLink>
              </HoverCardTrigger>
              <HoverCardContent>
                <FragilityPreviewSparkline />
              </HoverCardContent>
            </HoverCard>
          ) : (
            <NavigationMenuLink asChild>
              <Link
                to={route.to}
                className="flex rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                data-shortcut={route.to}
                onClick={closeMenu}
              >
                <route.icon className="mr-2 h-5 w-5" />
                <div className="flex-1">
                  <div className="text-sm font-medium leading-none flex items-center gap-2">
                    {route.label}
                    {route.badge && (
                      <Badge variant={route.badge}>{route.badge}</Badge>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {route.description}
                  </p>
                </div>
                <Star
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0",
                    favorites.includes(route.to)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(route.to);
                  }}
                />
              </Link>
            </NavigationMenuLink>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function GlobalNavigation() {
  const { favorites, toggleFavorite } = useFavorites();
  const { recentViews } = useRecentViews();
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
    [],
  );

  const allRoutes = React.useMemo(
    () => [
      ...dashboardRoutes.flatMap((g) => g.items),
      ...chartRouteGroups.flatMap((g) => g.items),
    ],
    [],
  );

  const favoriteRoutes = React.useMemo(
    () =>
      favorites
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as typeof allRoutes,
    [favorites, allRoutes],
  );

  const recentRoutes = React.useMemo(
    () =>
      recentViews
        .map((to) => allRoutes.find((r) => r.to === to))
        .filter(Boolean) as typeof allRoutes,
    [recentViews, allRoutes],
  );

  const renderFavorites = () =>
    favoriteRoutes.length > 0 && (
      <div className="mb-4">
        <h4 className="mb-2 font-medium leading-none">Favorites</h4>
        <RouteList
          routes={favoriteRoutes}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          closeMenu={closeMenu}
        />
      </div>
    );

  const renderRecent = () =>
    recentRoutes.length > 0 && (
      <div className="mb-4">
        <h4 className="mb-2 font-medium leading-none">Recent</h4>
        <RouteList
          routes={recentRoutes}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          closeMenu={closeMenu}
        />
      </div>
    );

  return (
    <NavigationMenu value={menuValue} onValueChange={setMenuValue}>
      <NavigationMenuList>
        <NavigationMenuItem value="analytics">
          <NavigationMenuTrigger data-shortcut="nav-analytics">
            Analytics
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            {renderFavorites()}
            {renderRecent()}
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
            {renderFavorites()}
            {renderRecent()}
            {chartRouteGroups.map((group) => (
              <div key={group.label} className="mb-4 last:mb-0">
                <h4 className="mb-2 font-medium leading-none">
                  {group.label}
                </h4>
                <RouteList
                  routes={group.items}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  closeMenu={closeMenu}
                />
              </div>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="maps">
          <NavigationMenuTrigger data-shortcut="nav-maps">
            Maps
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            {renderFavorites()}
            {renderRecent()}
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
            {renderFavorites()}
            {renderRecent()}
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
            {renderFavorites()}
            {renderRecent()}
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
