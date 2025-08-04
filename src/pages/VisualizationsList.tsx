import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes, chartRouteGroups, type DashboardRoute, type DashboardRouteGroup } from "@/routes";

const routeGroups: DashboardRouteGroup[] = [...dashboardRoutes, ...chartRouteGroups];
const routes: DashboardRoute[] = routeGroups.flatMap((group) => group.items);

export default function VisualizationsList() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Visualizations</h1>
      <ul className="space-y-2">
        {routes.map(({ to, label, description }) => (
          <li key={to}>
            <Link to={to} className="text-blue-600 hover:underline">
              {label}
            </Link>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

