import { FlaskConical } from "lucide-react";
import { withIcon, type DashboardRouteGroup } from "@/routes/types";

export const playgroundRoutes = withIcon(FlaskConical, [
  {
    to: "/dashboard/map",
    label: "State Visits Map",
    description: "View visited states on an interactive map",
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
]);

export const playgroundRouteGroup: DashboardRouteGroup = {
  label: "Playground",
  icon: FlaskConical,
  items: playgroundRoutes,
};

