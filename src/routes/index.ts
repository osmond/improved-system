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
        label: "Customizable Time-Series Trend",
        description: "Play with dynamic area chart interactions",
      },
      {
        to: "/dashboard/charts/steps-trend-with-goal",
        label: "Daily Step-Goal Achievement Trend",
        description: "Track steps against a target over time",
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
        to: "/dashboard/charts/time-in-bed-chart",
        label: "Sleep Duration Trend",
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
        to: "/dashboard/charts/weekly-volume-history-chart",
        label: "Weekly Training Volume Trend",
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
    ]),
  },
  {
    label: "Radial Charts",
    icon: ChartPie,
    items: withIcon(ChartPie, [
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
        to: "/dashboard/charts/reading-stack-split",
        label: "Stacked Radial Chart of Reading Time Split",
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
        label: "Correlation Heatmap of Metrics",
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
