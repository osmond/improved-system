import type { LucideIcon } from "lucide-react";
import {
  ChartArea,
  ChartBar,
  ChartLine,
  ChartPie,
  FlaskConical,
  Radar,
} from "lucide-react";

export interface DashboardRoute {
  to: string;
  label: string;
}

export interface DashboardRouteGroup {
  label: string;
  icon: LucideIcon;
  items: DashboardRoute[];
}

export const dashboardRoutes: DashboardRouteGroup[] = [
  {
    label: "Playground",
    icon: FlaskConical,
    items: [
      { to: "/dashboard/map", label: "Map playground" },
      { to: "/dashboard/route-similarity", label: "Route similarity" },
      { to: "/dashboard/route-novelty", label: "Route novelty" },
    ],
  },
  {
    label: "Analytics",
    icon: ChartLine,
    items: [
      { to: "/dashboard/mileage-globe", label: "Mileage Globe" },
      { to: "/dashboard/fragility", label: "Fragility" },
      { to: "/dashboard/session-similarity", label: "Session Similarity" },
      { to: "/dashboard/good-day", label: "Good Day" },
      { to: "/dashboard/habit-consistency", label: "Habit consistency" },
    ],
  },
];

export const chartRouteGroups: DashboardRouteGroup[] = [
  {
    label: "Area Charts",
    icon: ChartArea,
    items: [
      { to: "/dashboard/charts/area-chart-interactive", label: "Area Chart Interactive" },
      { to: "/dashboard/charts/steps-trend-with-goal", label: "Steps Trend With Goal" },
      { to: "/dashboard/charts/area-chart-load-ratio", label: "Area Chart Load Ratio" },
      { to: "/dashboard/charts/peer-benchmark-bands", label: "Peer Benchmark Bands" },
      { to: "/dashboard/charts/reading-probability-timeline", label: "Reading Probability Timeline" },
      { to: "/dashboard/charts/time-in-bed-chart", label: "Time In Bed Chart" },
    ],
  },
  {
    label: "Bar Charts",
    icon: ChartBar,
    items: [
      { to: "/dashboard/charts/bar-chart-interactive", label: "Bar Chart Interactive" },
      { to: "/dashboard/charts/bar-chart-default", label: "Bar Chart Default" },
      { to: "/dashboard/charts/bar-chart-horizontal", label: "Bar Chart Horizontal" },
      { to: "/dashboard/charts/bar-chart-mixed", label: "Bar Chart Mixed" },
      { to: "/dashboard/charts/bar-chart-label-custom", label: "Bar Chart Label Custom" },
      { to: "/dashboard/charts/shoe-usage-chart", label: "Shoe Usage Chart" },
      { to: "/dashboard/charts/equipment-usage-timeline", label: "Equipment Usage Timeline" },
      { to: "/dashboard/charts/treadmill-vs-outdoor", label: "Treadmill vs Outdoor" },
      { to: "/dashboard/charts/weekly-volume-history-chart", label: "Weekly Volume History Chart" },
    ],
  },
  {
    label: "Radar Charts",
    icon: Radar,
    items: [
      { to: "/dashboard/charts/radar-chart-default", label: "Radar Chart Default" },
      { to: "/dashboard/charts/radar-chart-workout-by-time", label: "Radar Chart Workout By Time" },
      { to: "/dashboard/charts/radar-chart-dots", label: "Radar Chart Dots" },
      { to: "/dashboard/charts/avg-daily-mileage-radar", label: "Avg Daily Mileage Radar" },
      { to: "/dashboard/charts/activity-by-time", label: "Activity By Time" },
    ],
  },
  {
    label: "Radial Charts",
    icon: ChartPie,
    items: [
      { to: "/dashboard/charts/radial-chart-label", label: "Radial Chart Label" },
      { to: "/dashboard/charts/radial-chart-text", label: "Radial Chart Text" },
      { to: "/dashboard/charts/radial-chart-grid", label: "Radial Chart Grid" },
      { to: "/dashboard/charts/reading-stack-split", label: "Reading Stack Split" },
    ],
  },
];

export const mapRoutes: DashboardRoute[] = [
  { to: "/dashboard/map", label: "Map playground" },
  { to: "/dashboard/route-similarity", label: "Route similarity" },
  { to: "/dashboard/route-novelty", label: "Route novelty" },
  { to: "/dashboard/mileage-globe", label: "Mileage Globe" },
];
