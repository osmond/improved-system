import {
  ChartArea,
  ChartBar,
  Radar,
  ChartPie,
  ChartLine,
  Shield,
  Settings,
} from "lucide-react";
import {
  withIcon,
  type DashboardRoute,
  type DashboardRouteGroup,
} from "./types";
import {
  analyticsRoutes,
  analyticsRouteGroup,
} from "@/features/analytics/routes";
import {
  playgroundRoutes,
  playgroundRouteGroup,
} from "@/features/playground/routes";

export const settingsRoutes = withIcon(Settings, [
  {
    to: "/dashboard/settings",
    label: "Intervention Settings",
    description: "Configure reminder preferences",
  },
]);

const settingsRouteGroup: DashboardRouteGroup = {
  label: "Settings",
  icon: Settings,
  items: settingsRoutes,
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
  playgroundRouteGroup,
  analyticsRouteGroup,
  settingsRouteGroup,
  privacyRouteGroup,
];

export const chartRouteGroups: DashboardRouteGroup[] = [
  {
    label: "Area Charts",
    icon: ChartArea,
    items: withIcon(ChartArea, [
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
    ]),
  },
  {
    label: "Bar Charts",
    icon: ChartBar,
    items: withIcon(ChartBar, [
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
    ]),
  },
  {
    label: "Radar Charts",
    icon: Radar,
    items: withIcon(Radar, [
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
    ]),
  },
  {
    label: "Radial Charts",
    icon: ChartPie,
    items: withIcon(ChartPie, [
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
    ]),
  },
  {
    label: "Matrix Charts",
    icon: ChartLine,
    items: withIcon(ChartLine, [
      {
        to: "/dashboard/statistics",
        label: "Metric Correlation Matrix",
        description: "Explore correlations between daily metrics",
      },
    ]),
  },
];

const allDashboardRoutes = dashboardRoutes.flatMap((group) => group.items);

export const mapRoutes = allDashboardRoutes.filter((route) =>
  route.tags?.includes("map"),
);

export { analyticsRoutes, playgroundRoutes };
export type { DashboardRoute, DashboardRouteGroup } from "./types";
