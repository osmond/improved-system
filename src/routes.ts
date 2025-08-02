export const dashboardRoutes = [
  {
    label: "Playground",
    items: [
      { to: "/dashboard/map", label: "Map playground" },
      { to: "/dashboard/route-similarity", label: "Route similarity" },
      { to: "/dashboard/route-novelty", label: "Route novelty" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/dashboard/mileage-globe", label: "Mileage Globe" },
      { to: "/dashboard/fragility", label: "Fragility" },
      { to: "/dashboard/session-similarity", label: "Session Similarity" },
      { to: "/dashboard/good-day", label: "Good Day" },
      { to: "/dashboard/habit-consistency", label: "Habit consistency" },
    ],
  },
  {
    label: "Examples",
    items: [
      { to: "/dashboard/examples/area-charts", label: "Area charts" },
      { to: "/dashboard/examples/bar-charts", label: "Bar charts" },
      { to: "/dashboard/examples/radar-charts", label: "Radar charts" },
      { to: "/dashboard/examples/radial-charts", label: "Radial charts" },
      { to: "/dashboard/examples/heatmaps", label: "Heatmaps" },
      { to: "/dashboard/examples/misc-charts", label: "Misc charts" },
    ],
  },
];

export type DashboardRouteGroup = (typeof dashboardRoutes)[number];
export type DashboardRoute = DashboardRouteGroup["items"][number];
