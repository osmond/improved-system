import type { LucideIcon } from "lucide-react";

export interface DashboardRoute {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
  tooltip?: string;
  tags?: string[];
  badge?: string;
  preview?: 'fragility';
}

export interface DashboardRouteGroup {
  label: string;
  icon: LucideIcon;
  items: DashboardRoute[];
}

export function withIcon(
  icon: LucideIcon,
  routes: Omit<DashboardRoute, "icon">[],
): DashboardRoute[] {
  return routes.map((route) => ({ ...route, icon }));
}

