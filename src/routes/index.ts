import {
  Map,
  TrendingUp,
  BarChart3,
  Goal,
  Shield,
} from "lucide-react";
import {
  withIcon,
  type DashboardRoute,
  type DashboardRouteGroup,
} from "./types";

export const mapsRoutes = withIcon(Map, [
  {
    to: "/dashboard/map",
    label: "State Visits Map",
    description: "View visited states on an interactive map",
    tags: ["map"],
  },
  {
    to: "/dashboard/mileage-globe",
    label: "Global Mileage Map",
    description: "Visualize mileage across the world using a globe",
    tags: ["map"],
  },
  {
    to: "/dashboard/route-similarity",
    label: "Route Similarity Analysis",
    description: "Compare routes based on similarity metrics",
    tags: ["map"],
  },
  {
    to: "/dashboard/route-novelty",
    label: "Route Novelty Analysis",
    description: "Assess how unique a route is compared to known paths",
    tags: ["map"],
  },
  {
    to: "/dashboard/behavioral-charter-map",
    label: "Behavioral Charter Map",
    description: "Timeline of activity segments with risk scores",
    tags: ["map"],
  },
]);

const mapsRouteGroup: DashboardRouteGroup = {
  label: "Maps",
  icon: Map,
  items: mapsRoutes,
};

export const trendsRoutes = withIcon(TrendingUp, [
  {
    to: "/dashboard/habit-consistency",
    label: "Habit Consistency Trend",
    description: "Track how consistently habits are maintained over time",
  },
  {
    to: "/dashboard/focus-history",
    label: "Focus History",
    description: "Review past focus detections and interventions",
  },
  {
    to: "/dashboard/charts/area-chart-interactive",
    label: "Customizable Time-Series Trend",
    description: "Play with dynamic area chart interactions",
  },
  {
    to: "/dashboard/charts/area-chart-load-ratio",
    label: "Training Load Ratio Over Time",
    description: "Monitor training load ratio changes",
  },
  {
    to: "/dashboard/charts/peer-benchmark-bands",
    label: "Performance Compared with Peers",
    description: "Compare performance against peers",
  },
  {
    to: "/dashboard/charts/reading-probability-timeline",
    label: "Reading Habit Likelihood Trend",
    description: "View reading likelihood over time",
  },
  {
    to: "/dashboard/charts/weekly-volume-history-chart",
    label: "Weekly Training Volume Trend",
    description: "Historical view of weekly training volume",
  },
]);

const trendsRouteGroup: DashboardRouteGroup = {
  label: "Trends",
  icon: TrendingUp,
  items: trendsRoutes,
};

export const analyticalRoutes = withIcon(BarChart3, [
  {
    to: "/dashboard/fragility",
    label: "Fragility Analysis",
    description: "Review training fragility indicators",
    preview: "fragility",
  },
  {
    to: "/dashboard/clinical-fragility-demo",
    label: "Clinical Fragility Demo",
    description: "Simulate outcome flips and fragility index",
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
    to: "/dashboard/statistics",
    label: "Metric Correlation Matrix",
    description: "Explore correlations between daily metrics",
  },
  {
    to: "/dashboard/charts/bar-chart-interactive",
    label: "Customizable Metric Comparison",
    description: "Experiment with interactive bar comparisons",
  },
  {
    to: "/dashboard/charts/bar-chart-default",
    label: "Standard Metric Comparison",
    description: "Basic bar chart for category comparison",
  },
  {
    to: "/dashboard/charts/bar-chart-horizontal",
    label: "Horizontal Metric Comparison",
    description: "Compare categories using horizontal bars",
  },
  {
    to: "/dashboard/charts/bar-chart-mixed",
    label: "Mixed Category Comparison",
    description: "View bars with mixed data series",
  },
  {
    to: "/dashboard/charts/bar-chart-label-custom",
    label: "Comparison with Custom Category Labels",
    description: "Bar chart demonstrating custom labels",
  },
  {
    to: "/dashboard/charts/shoe-usage-chart",
    label: "Running Shoe Mileage Comparison",
    description: "Compare mileage by shoe",
  },
  {
    to: "/dashboard/charts/treadmill-vs-outdoor",
    label: "Treadmill vs. Outdoor Running Comparison",
    description: "Compare treadmill and outdoor training",
  },
  {
    to: "/dashboard/charts/radar-chart-default",
    label: "Standard Multi-Metric Radar Profile",
    description: "Basic radar chart profile",
  },
  {
    to: "/dashboard/charts/radar-chart-workout-by-time",
    label: "Workout Time Distribution Radar",
    description: "Radar view of workout distribution by time",
  },
  {
    to: "/dashboard/charts/monthly-mileage-pattern",
    label: "Monthly Mileage Distribution Radar",
    description: "Radar chart with highlighted data points",
  },
  {
    to: "/dashboard/charts/avg-daily-mileage-radar",
    label: "Average Daily Mileage Profile",
    description: "Compare average daily mileage",
  },
  {
    to: "/dashboard/charts/activity-by-time",
    label: "Activity Time Allocation Radar",
    description: "Visualize activity levels across time",
  },
  {
    to: "/dashboard/charts/reading-stack-split",
    label: "Stacked Radial Chart of Reading Time Split",
    description: "Segment reading activity across categories",
  },
]);

const analyticalRouteGroup: DashboardRouteGroup = {
  label: "Analytical",
  icon: BarChart3,
  items: analyticalRoutes,
};

export const goalsRoutes = withIcon(Goal, [
  {
    to: "/dashboard/charts/steps-trend-with-goal",
    label: "Daily Step-Goal Achievement Trend",
    description: "Track steps against a target over time",
  },
  {
    to: "/dashboard/charts/time-in-bed-chart",
    label: "Sleep Duration Trend",
    description: "Examine time spent in bed",
  },
  {
    to: "/dashboard/charts/radial-chart-label",
    label: "Radial Progress Indicator with Segment Labels",
    description: "Radial progress chart with labels",
  },
  {
    to: "/dashboard/charts/radial-chart-text",
    label: "Radial Progress Indicator with Center Text",
    description: "Radial progress chart with text",
  },
  {
    to: "/dashboard/charts/radial-chart-grid",
    label: "Grid-Based Radial Progress Indicator",
    description: "Radial progress chart with grid",
  },
  {
    to: "/dashboard/settings",
    label: "Intervention Settings",
    description: "Configure reminder preferences",
  },
]);

const goalsRouteGroup: DashboardRouteGroup = {
  label: "Goals",
  icon: Goal,
  items: goalsRoutes,
};

export const privacyRoutes = withIcon(Shield, [
  {
    to: "/dashboard/privacy",
    label: "Privacy Dashboard",
    description: "Manage data retention and export/delete options",
  },
]);

const privacyRouteGroup: DashboardRouteGroup = {
  label: "Privacy",
  icon: Shield,
  items: privacyRoutes,
};

export const dashboardRoutes: DashboardRouteGroup[] = [
  mapsRouteGroup,
  trendsRouteGroup,
  analyticalRouteGroup,
  goalsRouteGroup,
  privacyRouteGroup,
];

export type { DashboardRoute, DashboardRouteGroup } from "./types";

