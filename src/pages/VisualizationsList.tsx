import React from "react";
import { Link } from "react-router-dom";
import {
  dashboardRouteMeta as dashboardRoutes,
  type DashboardRoute,
  type DashboardRouteGroup,
} from "@/routes/meta";

function flattenRoutes(groups: DashboardRouteGroup[]): DashboardRoute[] {
  return groups.flatMap((group) => [
    ...(group.items ?? []),
    ...(group.groups ? flattenRoutes(group.groups) : []),
  ]);
}

const routes: DashboardRoute[] = flattenRoutes(dashboardRoutes).filter(
  (route) => route.to !== "/dashboard/all",
);

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

