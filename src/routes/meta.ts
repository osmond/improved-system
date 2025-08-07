import type { DashboardRouteGroup } from "./types";
import { analyticsRouteGroup } from "@/features/analytics/routes";
import { playgroundRouteGroup } from "@/features/playground/routes";
import { readingRouteGroup } from "@/features/reading/routes";

// Group metadata for dashboard routes. Add additional groups as needed.
export const dashboardRouteMeta: DashboardRouteGroup[] = [
  analyticsRouteGroup,
  playgroundRouteGroup,
  readingRouteGroup,
];
