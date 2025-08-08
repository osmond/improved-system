import { BookOpen } from "lucide-react";
import { withIcon, type DashboardRouteGroup } from "@/routes/types";

export const readingRoutes = withIcon(BookOpen, [
  {
    to: "/dashboard/charts/book-network",
    label: "Book Network",
    description: "Explore connections between books.",
  },
  {
    to: "/dashboard/charts/book-progress-spiral",
    label: "Book Progress Spiral",
    description: "View reading progress as a spiral.",
  },
  {
    to: "/dashboard/charts/bookshelf-by-year",
    label: "Bookshelf by Year",
    description: "See books organized by reading year.",
  },
  {
    to: "/dashboard/charts/genre-sankey",
    label: "Genre Sankey",
    description: "Trace genre flows with a Sankey diagram.",
  },
  {
    to: "/dashboard/charts/genre-sunburst",
    label: "Genre Sunburst",
    description: "Explore genre hierarchy with a sunburst.",
  },
  {
    to: "/dashboard/charts/reading-calendar-heatmap",
    label: "Reading Calendar Heatmap",
    description: "Calendar heatmap of reading activity.",
  },
  {
    to: "/dashboard/charts/reading-map",
    label: "Reading Map",
    description: "Map books to their geographic settings.",
  },
  {
    to: "/dashboard/charts/reading-probability-timeline",
    label: "Reading Probability Timeline",
    description: "Timeline of reading probability.",
  },
  {
    to: "/dashboard/charts/reading-speed-violin",
    label: "Reading Speed Violin",
    description: "Distribution of reading speed via violin plot.",
  },
  {
    to: "/dashboard/charts/reading-timeline",
    label: "Reading Timeline",
    description: "Chronological view of reading history.",
  },
  {
    to: "/dashboard/charts/word-tree",
    label: "Word Tree",
    description: "Analyze word usage with a word tree.",
  },
]);

export const readingRouteGroup: DashboardRouteGroup = {
  label: "Kindle Visualizations",
  icon: BookOpen,
  items: readingRoutes,
};
