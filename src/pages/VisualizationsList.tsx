import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes, type DashboardRoute } from "@/routes";

const routes: DashboardRoute[] = dashboardRoutes
  .flatMap((group) => group.items)
  .filter((route) => route.to !== "/dashboard/all");

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

