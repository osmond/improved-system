import { ChartLine } from "lucide-react";
import { withIcon, type DashboardRouteGroup } from "@/routes/types";

export const analyticsRoutes = withIcon(ChartLine, [
  {
    to: "/dashboard/mileage-globe",
    label: "Global Mileage Map",
    description: "Visualize mileage across the world using a globe",
    tags: ["map"],
  },
  {
    to: "/dashboard/fragility",
    label: "Fragility Analysis",
    description: "Review training fragility indicators",
    preview: 'fragility',
  },
  {
    to: "/dashboard/session-similarity",
    label: "Session Similarity Analysis",
    description: "Find training sessions that resemble each other",
  },
  {
    to: "/dashboard/good-day",
    label: "Good Day Analysis",
    description: "Identify patterns that contribute to positive days",
  },
  {
    to: "/dashboard/habit-consistency",
    label: "Habit Consistency Trend",
    description: "Track how consistently habits are maintained over time",
  },
  {
    to: "/dashboard/statistics",
    label: "Metric Correlation Matrix",
    description: "Explore correlations between daily metrics",
  },
  {
    to: "/dashboard/focus-history",
    label: "Focus History",
    description: "Review past focus detections and interventions",
  },
  {
    to: "/dashboard/behavioral-charter-map",
    label: "Behavioral Charter Map",
    description: "Timeline of activity segments with risk scores",
  },
]);

export const analyticsRouteGroup: DashboardRouteGroup = {
  label: "Analytics",
  icon: ChartLine,
  items: analyticsRoutes,
};

