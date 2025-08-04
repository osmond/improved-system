import * as React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import {
  NavigationMenuLink,
} from "@/ui/navigation-menu";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/ui/hover-card";
import { FragilityPreviewSparkline } from "@/components/dashboard";
import type { DashboardRoute } from "@/routes";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";

interface RouteListProps {
  routes: DashboardRoute[];
  favorites: string[];
  toggleFavorite: (to: string) => void;
  closeMenu?: () => void;
}

export default function RouteList({
  routes,
  favorites,
  toggleFavorite,
  closeMenu,
}: RouteListProps) {
  return (
    <ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
      {routes.map((route) => (
        <li key={route.to}>
          {route.preview === "fragility" ? (
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

