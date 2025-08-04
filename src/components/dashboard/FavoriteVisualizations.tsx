import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/ui/card";
import { dashboardRoutes } from "@/routes";
import useNavigationFavorites from "@/hooks/useNavigationFavorites";

/**
 * Displays quick links to pinned dashboard visualizations.
 *
 * Uses the `useNavigationFavorites` hook to read the user's list of
 * favorite routes and renders them as a simple list of links. When there
 * are no favorites the component renders nothing.
 */
export default function FavoriteVisualizations() {
  const allRoutes = React.useMemo(
    () => dashboardRoutes.flatMap((group) => group.items),
    [],
  );
  const { favoriteRoutes } = useNavigationFavorites(allRoutes);

  if (favoriteRoutes.length === 0) return null;

  return (
    <Card className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">Pinned Visualizations</h2>
      <ul className="space-y-1">
        {favoriteRoutes.map((route) => (
          <li key={route.to}>
            <Link
              to={route.to}
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

