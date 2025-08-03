import * as React from "react";
import { Link } from "react-router-dom";
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
import {
  analyticsRoutes,
  chartRouteGroups,
  mapRoutes,
  settingsRoutes,
  dashboardRoutes,
  type DashboardRoute,
} from "@/routes";

function RouteList({ routes }: { routes: DashboardRoute[] }) {
  return (
    <ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
      {routes.map((route) => (
        <li key={route.to}>
          <NavigationMenuLink asChild>
            <Link
              to={route.to}
              className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
            >
              <div className="text-sm font-medium leading-none">
                {route.label}
              </div>
              {route.description && (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {route.description}
                </p>
              )}
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

export default function GlobalNavigation() {
  const insightsRoutes = React.useMemo(
    () =>
      dashboardRoutes.find((g) => g.label === "Privacy")?.items ?? [],
    []
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <RouteList routes={analyticsRoutes} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Charts</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            {chartRouteGroups.map((group) => (
              <div key={group.label} className="mb-4 last:mb-0">
                <h4 className="mb-2 font-medium leading-none">
                  {group.label}
                </h4>
                <RouteList routes={group.items} />
              </div>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Maps</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <RouteList routes={mapRoutes} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Insights/Personal</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <RouteList routes={insightsRoutes} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings/Tools</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
            <RouteList routes={settingsRoutes} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
