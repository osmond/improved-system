export interface DashboardRoute {
  to: string;
  label: string;
}

export interface DashboardRouteGroup {
  label: string;
  items: DashboardRoute[];
}

export const dashboardRoutes: DashboardRouteGroup[] = [
  {
    label: "Maps",
    items: [
      { to: "/dashboard/map", label: "Map playground" },
      { to: "/dashboard/route-similarity", label: "Route similarity" },
      { to: "/dashboard/route-novelty", label: "Route novelty" },
      { to: "/dashboard/mileage-globe", label: "Mileage Globe" },
    ],
  },
  {
    label: "Session Analysis",
    items: [
      { to: "/dashboard/fragility", label: "Fragility" },
      { to: "/dashboard/session-similarity", label: "Session Similarity" },
      { to: "/dashboard/good-day", label: "Good Day" },
      { to: "/dashboard/habit-consistency", label: "Habit consistency" },
    ],
  },
  {
    label: "Examples",
    items: [{ to: "/dashboard/examples", label: "Analytics fun" }],
  },
];
