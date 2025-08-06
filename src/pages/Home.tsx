import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoutes } from "@/routes";

// Build a map of existing page modules so we can filter out
// routes pointing to non-existent components.
// Vite's import.meta.glob gives us an object where keys are paths
// relative to this file's directory (src/pages).
const pageModules = import.meta.glob("./**/*.{ts,tsx,js,jsx}");

function hasPage(component?: string) {
  if (!component) return true;
  // Convert the @/pages/* path to a relative path like ./foo
  const path = component.replace("@/pages", ".");
  return (
    pageModules[`${path}.tsx`] ||
    pageModules[`${path}.ts`] ||
    pageModules[`${path}.jsx`] ||
    pageModules[`${path}.js`]
  );
}

export default function Home() {
  // Filter out routes that don't have an existing page module
  const groups = dashboardRoutes
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPage(item.component)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {groups.map((group) => (
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
      ))}
    </div>
  );
}

