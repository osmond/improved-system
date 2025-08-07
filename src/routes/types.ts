import type { LucideIcon } from "lucide-react";

export interface DashboardRoute {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
  /**
   * Resolvable module path for the React component that should render this
   * route. The path is used with a dynamic `import()` call so it should be a
   * valid module specifier (e.g. "@/pages/Foo").
   */
  component?: string;
  tooltip?: string;
  tags?: string[];
  badge?: string;
  preview?: 'fragility';
}

export interface DashboardRouteGroup {
  label: string;
  icon: LucideIcon;
  /**
   * Routes that belong directly to this group. When `groups` is provided these
   * are treated as leaf nodes in the navigation tree.
   */
  items?: DashboardRoute[];
  /**
   * Optional sub-groups used to further categorize routes.
   */
  groups?: DashboardRouteGroup[];
}

export function withIcon(
  icon: LucideIcon,
  routes: Omit<DashboardRoute, "icon">[],
): DashboardRoute[] {
  return routes.map((route) => ({ ...route, icon }));
}

