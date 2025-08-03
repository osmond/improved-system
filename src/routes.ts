import type { LucideIcon } from "lucide-react";
import {
  ChartArea,
  ChartBar,
  ChartPie,
  Radar,
  ChartLine,
  FlaskConical,
} from "lucide-react";

export interface DashboardRoute {
  to: string;
  label: string;
  description?: string;
  tooltip?: string;
}

export interface DashboardRouteGroup {
  label: string;
  icon: LucideIcon;
  items: DashboardRoute[];
}


export const analyticsRoutes: DashboardRoute[] = [
  {
    to: "/dashboard/mileage-globe",
    label: "Global Mileage Map",
    description: "Visualize mileage across the world using a globe",
  },
  {
    to: "/dashboard/fragility",
    label: "Fragility Analysis",
    description: "Review training fragility indicators",
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
    to: "/dashboard/settings",
    label: "Intervention Settings",
    description: "Configure reminder preferences",
  },
];

export const dashboardRoutes: DashboardRouteGroup[] = [
  {
    label: "Playground",
    icon: FlaskConical,
    items: [
      {
        to: "/dashboard/map",
        label: "State Visits Map",
        description: "View visited states on an interactive map",
      },
      {
        to: "/dashboard/route-similarity",
        label: "Route Similarity Analysis",
        description: "Compare routes based on similarity metrics",
      },
      {
        to: "/dashboard/route-novelty",
        label: "Route Novelty Analysis",
        description: "Assess how unique a route is compared to known paths",
      },
    ],
  },
  {
    label: "Analytics",
    icon: ChartLine,
    items: analyticsRoutes,
  },
];


export const chartRouteGroups: DashboardRouteGroup[] = [
  {
    label: "Area Charts",
    icon: ChartArea,
    items: [
      {
        to: "/dashboard/charts/area-chart-interactive",
        label: "Interactive Trend",
        description: "Play with dynamic area chart interactions",
      },
      {
        to: "/dashboard/charts/steps-trend-with-goal",
        label: "Step Goal Trend",
        description: "Track steps against a target over time",
      },
      {
        to: "/dashboard/charts/area-chart-load-ratio",
        label: "Load Ratio Trend",
        description: "Monitor training load ratio changes",
      },
      {
        to: "/dashboard/charts/peer-benchmark-bands",
        label: "Peer Benchmark Trend",
        description: "Compare performance against peers",
      },
      {
        to: "/dashboard/charts/reading-probability-timeline",
        label: "Reading Probability Trend",
        description: "View reading likelihood over time",
      },
      {
        to: "/dashboard/charts/time-in-bed-chart",
        label: "Time in Bed Trend",
        description: "Examine time spent in bed",
      },
    ],
  },
  {
    label: "Bar Charts",
    icon: ChartBar,
    items: [
      {
        to: "/dashboard/charts/bar-chart-interactive",
        label: "Interactive Comparison",
        description: "Experiment with interactive bar comparisons",
      },
      {
        to: "/dashboard/charts/bar-chart-default",
        label: "Default Bar Comparison",
        description: "Basic bar chart for category comparison",
      },
      {
        to: "/dashboard/charts/bar-chart-horizontal",
        label: "Horizontal Bar Comparison",
        description: "Compare categories using horizontal bars",
      },
      {
        to: "/dashboard/charts/bar-chart-mixed",
        label: "Mixed Bar Comparison",
        description: "View bars with mixed data series",
      },
      {
        to: "/dashboard/charts/bar-chart-label-custom",
        label: "Custom Label Comparison",
        description: "Bar chart demonstrating custom labels",
      },
      { 
        to: "/dashboard/charts/shoe-usage-chart",
        label: "Shoe Usage Comparison",
        description: "Compare mileage by shoe",
      },
      {
        to: "/dashboard/charts/treadmill-vs-outdoor",
        label: "Treadmill vs Outdoor Comparison",
        description: "Compare treadmill and outdoor training",
      },
      {
        to: "/dashboard/charts/weekly-volume-history-chart",
        label: "Weekly Volume Trend",
        description: "Historical view of weekly training volume",
      },
    ],
  },
  {
    label: "Radar Charts",
    icon: Radar,
    items: [
      {
        to: "/dashboard/charts/radar-chart-default",
        label: "Default Radar Profile",
        description: "Basic radar chart profile",
      },
      {
        to: "/dashboard/charts/radar-chart-workout-by-time",
        label: "Workout Time Radar",
        description: "Radar view of workout distribution by time",
      },
      {
        to: "/dashboard/charts/monthly-mileage-pattern",
        label: "Monthly Mileage Pattern",
        description: "Radar chart with highlighted data points",
      },
      {
        to: "/dashboard/charts/avg-daily-mileage-radar",
        label: "Average Daily Mileage Radar",
        description: "Compare average daily mileage",
      },
      {
        to: "/dashboard/charts/activity-by-time",
        label: "Activity Time Radar",
        description: "Visualize activity levels across time",
      },
    ],
  },
  {
    label: "Radial Charts",
    icon: ChartPie,
    items: [
      {
        to: "/dashboard/charts/radial-chart-label",
        label: "Labeled Radial Progress",
        description: "Radial progress chart with labels",
      },
      {
        to: "/dashboard/charts/radial-chart-text",
        label: "Text Radial Progress",
        description: "Radial progress chart with text",
      },
      {
        to: "/dashboard/charts/radial-chart-grid",
        label: "Grid Radial Progress",
        description: "Radial progress chart with grid",
      },
      {
        to: "/dashboard/charts/reading-stack-split",
        label: "Reading Stack Split",
        description: "Segment reading activity across categories",
      },
    ],
  },
  {
    label: "Matrix Charts",
    icon: ChartLine,
    items: [
      {
        to: "/dashboard/statistics",
        label: "Metric Correlation Matrix",
        description: "Explore correlations between daily metrics",
      },
    ],
  },
];

export const mapRoutes: DashboardRoute[] = [
  {
    to: "/dashboard/map",
    label: "State Visits Map",
    description: "View visited states on an interactive map",
  },
  {
    to: "/dashboard/route-similarity",
    label: "Route Similarity Analysis",
    description: "Compare routes based on similarity metrics",
  },
  {
    to: "/dashboard/route-novelty",
    label: "Route Novelty Analysis",
    description: "Assess how unique a route is compared to known paths",
  },
  {
    to: "/dashboard/mileage-globe",
    label: "Global Mileage Map",
    description: "Visualize mileage across the world using a globe",
  },
];
