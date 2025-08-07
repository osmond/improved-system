import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { dashboardRouteMeta as dashboardRoutes } from "@/routes/meta";

const routeLabelMap: Record<string, string> = {};
for (const group of dashboardRoutes) {
  for (const item of group.items) {
    routeLabelMap[item.to] = item.label;
  }
}
routeLabelMap["/"] = "Dashboard";
routeLabelMap["/dashboard/all"] = "Dashboard";

interface BreadcrumbsProps {
  /**
   * Optional custom labels for dynamic route parameters.
   * Provide an object where keys are parameter names and values are labels.
   */
  labels?: Record<string, string>;
}

function startCase(str: string): string {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Breadcrumbs({ labels = {} }: BreadcrumbsProps) {
  const location = useLocation();
  const params = useParams();
  let segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    segments = ["dashboard"];
  }

  if (segments[0] === "dashboard" && segments[1] === "all") {
    segments = ["dashboard"];
  }

  const crumbs = segments.map((segment, index) => {
    let to = "/" + segments.slice(0, index + 1).join("/");
    if (index === 0 && segment === "dashboard") {
      to = "/";
    }
    let label: string | undefined;

    const paramEntry = Object.entries(params).find(([, value]) => value === segment);
    if (paramEntry) {
      const [paramName] = paramEntry;
      label = labels[paramName];
    }

    if (!label) {
      label = routeLabelMap[to];
    }

    if (!label) {
      label = startCase(segment);
    }

    return { to, label };
  });

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.to} className="flex items-center gap-1">
              {index > 0 && <span>/</span>}
              {isLast ? (
                <span className="text-foreground">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

