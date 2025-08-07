import React from "react";
import { Link } from "react-router-dom";
import { dashboardRouteMeta as dashboardRoutes } from "@/routes/meta";

export default function Home() {
  const groups = dashboardRoutes;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {groups.length === 0 ? (
        <p>No dashboards configured.</p>
      ) : (
        groups.map((group) => (
          <section key={group.label} className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {group.label}
            </h2>
            <ul className="space-y-1 ml-4 list-disc">
              {group.items.map(({ to, label, description }) => (
                <li key={to}>
                  <Link to={to} className="text-blue-600 hover:underline">
                    {label}
                  </Link>
                  {description && (
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

