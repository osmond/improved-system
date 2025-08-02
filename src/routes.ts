export const dashboardRoutes = [
  { to: "/dashboard/map", label: "Map playground" },
  { to: "/dashboard/route-similarity", label: "Route similarity" },
  { to: "/dashboard/route-novelty", label: "Route novelty" },
  { to: "/dashboard/examples", label: "Analytics fun" },
  { to: "/dashboard/mileage-globe", label: "Mileage Globe" },
  { to: "/dashboard/fragility", label: "Fragility" },
  { to: "/dashboard/session-similarity", label: "Session Similarity" },
  { to: "/dashboard/good-day", label: "Good Day" },
  { to: "/dashboard/habit-consistency", label: "Habit consistency" },
];

export type DashboardRoute = (typeof dashboardRoutes)[number];
