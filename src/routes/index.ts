import {
  Map,
  TrendingUp,
  BarChart3,
  Goal,
  Shield,
  List,
  BookOpen,
  FlaskConical,
  MoreHorizontal,
} from "lucide-react";
import {
  withIcon,
  type DashboardRoute,
  type DashboardRouteGroup,
} from "./types";

export const allRoutes = withIcon(List, [
  {
    to: "/dashboard/all",
    label: "All Visualizations",
    description: "Browse all available visualizations",
    component: "@/pages/VisualizationsList",
  },
]);

const allRouteGroup: DashboardRouteGroup = {
  label: "All",
  icon: List,
  items: allRoutes,
};

export const mapsRoutes = withIcon(Map, [
  {
    to: "/dashboard/map",
    label: "State Visits Map",
    description: "View visited states on an interactive map",
    component: "@/pages/MapPlayground",
    tags: ["map"],
  },
  {
    to: "/dashboard/mileage-globe",
    label: "Global Mileage Map",
    description: "Visualize mileage across the world using a globe",
    component: "@/pages/MileageGlobe",
    tags: ["map"],
  },
  {
    to: "/dashboard/route-similarity",
    label: "Route Similarity Analysis",
    description: "Compare routes based on similarity metrics",
    component: "@/pages/RouteSimilarity",
    tags: ["map"],
  },
  {
    to: "/dashboard/route-novelty",
    label: "Route Novelty Analysis",
    description: "Assess how unique a route is compared to known paths",
    component: "@/pages/RouteNovelty",
    tags: ["map"],
  },
  {
    to: "/dashboard/behavioral-charter-map",
    label: "Behavioral Charter Map",
    description: "Timeline of activity segments with risk scores",
    component: "@/pages/BehavioralCharterMap",
    tags: ["map"],
  },
]);

const mapsRouteGroup: DashboardRouteGroup = {
  label: "Maps & Routes",
  icon: Map,
  items: mapsRoutes,
};

export const trendsRoutes = withIcon(TrendingUp, [
  {
    to: "/dashboard/habit-consistency",
    label: "Habit Consistency Trend",
    description: "Track how consistently habits are maintained over time",
    component: "@/pages/HabitConsistency",
  },
  {
    to: "/dashboard/focus-history",
    label: "Focus History",
    description: "Review past focus detections and interventions",
    component: "@/pages/FocusHistory",
  },
  {
    to: "/dashboard/charts/area-chart-interactive",
    label: "Customizable Time-Series Trend",
    description: "Play with dynamic area chart interactions",
    component: "@/pages/charts/AreaChartInteractive",
  },
  {
    to: "/dashboard/charts/area-chart-load-ratio",
    label: "Training Load Ratio Over Time",
    description: "Monitor training load ratio changes",
    component: "@/pages/charts/AreaChartLoadRatio",
  },
  {
    to: "/dashboard/charts/peer-benchmark-bands",
    label: "Performance Compared with Peers",
    description: "Compare performance against peers",
    component: "@/pages/charts/PeerBenchmarkBands",
  },
  {
    to: "/dashboard/charts/reading-probability-timeline",
    label: "Reading Habit Likelihood Trend",
    description: "View reading likelihood over time",
    component: "@/pages/charts/ReadingProbabilityTimeline",
  },
  {
    to: "/dashboard/charts/weekly-volume-history-chart",
    label: "Weekly Training Volume Trend",
    description: "Historical view of weekly training volume",
    component: "@/pages/charts/WeeklyVolumeHistoryChart",
  },
  {
    to: "/dashboard/charts/line-chart-interactive",
    label: "Interactive Metric Trend",
    description: "Experiment with dynamic line chart interactions",
    component: "@/pages/charts/LineChartInteractive",
  },
]);

const trendsRouteGroup: DashboardRouteGroup = {
  label: "Trends & Comparisons",
  icon: TrendingUp,
  items: trendsRoutes,
};

export const analyticalRoutes = withIcon(BarChart3, [
  {
    to: "/dashboard/fragility",
    label: "Fragility Analysis",
    description: "Review training fragility indicators",
    component: "@/pages/Fragility",
    preview: "fragility",
  },
  {
    to: "/dashboard/clinical-fragility-demo",
    label: "Clinical Fragility Demo",
    description: "Simulate outcome flips and fragility index",
    component: "@/pages/ClinicalFragilityDemo",
  },
  {
    to: "/dashboard/session-similarity",
    label: "Session Similarity Analysis",
    description: "Find training sessions that resemble each other",
    component: "@/pages/SessionSimilarity",
  },
  {
    to: "/dashboard/good-day",
    label: "Good Day Analysis",
    description: "Identify patterns that contribute to positive days",
    component: "@/pages/GoodDay",
  },
  {
    to: "/dashboard/statistics",
    label: "Metric Correlation Matrix",
    description: "Explore correlations between daily metrics",
    component: "@/pages/Statistics",
  },
  {
    to: "/dashboard/charts/bar-chart-interactive",
    label: "Customizable Metric Comparison",
    description: "Experiment with interactive bar comparisons",
    component: "@/pages/charts/BarChartInteractive",
  },
  {
    to: "/dashboard/charts/bar-chart-default",
    label: "Standard Metric Comparison",
    description: "Basic bar chart for category comparison",
    component: "@/pages/charts/BarChartDefault",
  },
  {
    to: "/dashboard/charts/bar-chart-horizontal",
    label: "Horizontal Metric Comparison",
    description: "Compare categories using horizontal bars",
    component: "@/pages/charts/BarChartHorizontal",
  },
  {
    to: "/dashboard/charts/bar-chart-mixed",
    label: "Mixed Category Comparison",
    description: "View bars with mixed data series",
    component: "@/pages/charts/BarChartMixed",
  },
  {
    to: "/dashboard/charts/bar-chart-label-custom",
    label: "Comparison with Custom Category Labels",
    description: "Bar chart demonstrating custom labels",
    component: "@/pages/charts/BarChartLabelCustom",
  },
  {
    to: "/dashboard/charts/shoe-usage-chart",
    label: "Running Shoe Mileage Comparison",
    description: "Compare mileage by shoe",
    component: "@/pages/charts/ShoeUsageChart",
  },
  {
    to: "/dashboard/charts/treadmill-vs-outdoor",
    label: "Treadmill vs. Outdoor Running Comparison",
    description: "Compare treadmill and outdoor training",
    component: "@/pages/charts/TreadmillVsOutdoor",
  },
  {
    to: "/dashboard/charts/radar-chart-default",
    label: "Standard Multi-Metric Radar Profile",
    description: "Basic radar chart profile",
    component: "@/pages/charts/RadarChartDefault",
  },
  {
    to: "/dashboard/charts/radar-chart-workout-by-time",
    label: "Workout Time Distribution Radar",
    description: "Radar view of workout distribution by time",
    component: "@/pages/charts/RadarChartWorkoutByTime",
  },
  {
    to: "/dashboard/charts/monthly-mileage-pattern",
    label: "Monthly Mileage Distribution Radar",
    description: "Radar chart with highlighted data points",
    component: "@/pages/charts/MonthlyMileagePattern",
  },
  {
    to: "/dashboard/charts/avg-daily-mileage-radar",
    label: "Average Daily Mileage Profile",
    description: "Compare average daily mileage",
    component: "@/pages/charts/AvgDailyMileageRadar",
  },
  {
    to: "/dashboard/charts/activity-by-time",
    label: "Activity Time Allocation Radar",
    description: "Visualize activity levels across time",
    component: "@/pages/charts/ActivityByTime",
  },
  {
    to: "/dashboard/charts/reading-stack-split",
    label: "Stacked Radial Chart of Reading Time Split",
    description: "Segment reading activity across categories",
    component: "@/pages/charts/ReadingStackSplit",
  },
  {
    to: "/dashboard/charts/ghost-self-rival-chart",
    label: "Ghost vs Self vs Rival Comparison",
    description: "Compare performance against a ghost, yourself, and a rival",
    component: "@/pages/charts/GhostSelfRivalChart",
  },
  {
    to: "/dashboard/charts/perf-vs-environment-matrix",
    label: "Performance vs Environment Matrix",
    description: "Matrix of performance across environmental factors",
    component: "@/pages/charts/PerfVsEnvironmentMatrix",
  },
  {
    to: "/dashboard/charts/training-entropy-heatmap",
    label: "Training Entropy Heatmap",
    description: "Visualize training variability using entropy",
    component: "@/pages/charts/TrainingEntropyHeatmap",
  },
  {
    to: "/dashboard/charts/scatter-chart-pace-heart-rate",
    label: "Pace vs Heart Rate Scatter",
    description: "Explore relationship between pace and heart rate",
    component: "@/pages/charts/ScatterChartPaceHeartRate",
  },
]);

const analyticalRouteGroup: DashboardRouteGroup = {
  label: "Analytical Insights",
  icon: BarChart3,
  items: analyticalRoutes,
};

export const demoRoutes = withIcon(FlaskConical, [
  {
    to: "/dashboard/charts/compact-next-game-card",
    label: "Next Game Summary Card",
    description: "Compact card showing upcoming game details",
    component: "@/pages/charts/CompactNextGameCard",
  },
  {
    to: "/dashboard/charts/run-soundtrack-card-demo",
    label: "Run Soundtrack Recommendation",
    description: "Card demo of personalized run soundtrack",
    component: "@/pages/charts/RunSoundtrackCardDemo",
  },
]);

export const kindleRoutes = withIcon(BookOpen, [
  {
    to: "/dashboard/kindle/calendar-heatmap",
    label: "Daily Reading Calendar",
    description: "GitHub-style calendar of reading activity",
    component: "@/pages/charts/ReadingCalendarHeatmap",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/timeline",
    label: "Reading Timeline",
    description: "Interactive timeline of sessions",
    component: "@/pages/charts/ReadingTimeline",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/genre-sunburst",
    label: "Genre Hierarchy Sunburst",
    description: "Drill into genres by reading time",
    component: "@/pages/charts/GenreSunburst",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/genre-sankey",
    label: "Genre Transition Sankey",
    description: "Flow of reading across genres",
    component: "@/pages/charts/GenreSankey",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/word-tree",
    label: "Highlight Word Tree",
    description: "Explore highlight contexts",
    component: "@/pages/charts/WordTree",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/reading-map",
    label: "Reading Locations Map",
    description: "Geospatial heatmap of reading",
    component: "@/pages/charts/ReadingMap",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/reading-speed",
    label: "Reading Speed Distribution",
    description: "Violin plot of reading speed",
    component: "@/pages/charts/ReadingSpeedViolin",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/book-network",
    label: "Related Books Network",
    description: "Force-directed graph of books",
    component: "@/pages/charts/BookNetwork",
    tags: ["kindle"],
  },
  {
    to: "/dashboard/kindle/book-progress-spiral",
    label: "Book Progress Spirals",
    description: "Spiral chart of book progress over time",
    component: "@/pages/charts/BookProgressSpiral",
    tags: ["kindle"],
  },
]);

const kindleRouteGroup: DashboardRouteGroup = {
  label: "Kindle Insights",
  icon: BookOpen,
  items: kindleRoutes,
};

export const goalsRoutes = withIcon(Goal, [
  {
    to: "/dashboard/charts/steps-trend-with-goal",
    label: "Daily Step-Goal Achievement Trend",
    description: "Track steps against a target over time",
    component: "@/pages/charts/StepsTrendWithGoal",
  },
  {
    to: "/dashboard/charts/time-in-bed-chart",
    label: "Sleep Duration Trend",
    description: "Examine time spent in bed",
    component: "@/pages/charts/TimeInBedChart",
  },
  {
    to: "/dashboard/charts/radial-chart-label",
    label: "Radial Progress Indicator with Segment Labels",
    description: "Radial progress chart with labels",
    component: "@/pages/charts/RadialChartLabel",
  },
  {
    to: "/dashboard/charts/radial-chart-text",
    label: "Radial Progress Indicator with Center Text",
    description: "Radial progress chart with text",
    component: "@/pages/charts/RadialChartText",
  },
  {
    to: "/dashboard/charts/radial-chart-grid",
    label: "Grid-Based Radial Progress Indicator",
    description: "Radial progress chart with grid",
    component: "@/pages/charts/RadialChartGrid",
  },
  {
    to: "/dashboard/settings",
    label: "Intervention Settings",
    description: "Configure reminder preferences",
    component: "@/pages/InterventionSettings",
  },
]);

const goalsRouteGroup: DashboardRouteGroup = {
  label: "Goals & Progress",
  icon: Goal,
  items: goalsRoutes,
};

export const privacyRoutes = withIcon(Shield, [
  {
    to: "/dashboard/privacy",
    label: "Privacy Dashboard",
    description: "Manage data retention and export/delete options",
    component: "@/pages/PrivacyDashboard",
  },
]);

const otherRouteGroup: DashboardRouteGroup = {
  label: "Other",
  icon: MoreHorizontal,
  items: [...demoRoutes, ...privacyRoutes],
};

export const dashboardRoutes: DashboardRouteGroup[] = [
  kindleRouteGroup,
  allRouteGroup,
  mapsRouteGroup,
  trendsRouteGroup,
  analyticalRouteGroup,
  goalsRouteGroup,
  otherRouteGroup,
];

export type { DashboardRoute, DashboardRouteGroup } from "./types";

