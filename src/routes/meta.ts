import type { DashboardRouteGroup } from "./types";
import { analyticsRouteGroup } from "@/features/analytics/routes";
import { playgroundRouteGroup } from "@/features/playground/routes";

// Group metadata for dashboard routes. Add additional groups as needed.
export const dashboardRouteMeta: DashboardRouteGroup[] = [
  analyticsRouteGroup,
  playgroundRouteGroup,
];
