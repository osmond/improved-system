import React from "react";
import MapPage from "@/pages/Map";
import RouteSimilarityPage from "@/pages/RouteSimilarity";
import RouteNoveltyMapPage from "@/pages/RouteNoveltyMap";
import ExamplesPage from "@/pages/Examples";
import MileageGlobePage from "@/pages/MileageGlobePage";
import FragilityGaugePage from "@/pages/FragilityGauge";
import SessionSimilarityMapPage from "@/pages/SessionSimilarityMap";
import GoodDayMapPage from "@/pages/GoodDayMap";
import HabitConsistencyHeatmapPage from "@/pages/HabitConsistencyHeatmap";

export const dashboardRoutes = [
  { to: "/dashboard/map", label: "Map playground", element: <MapPage /> },
  { to: "/dashboard/route-similarity", label: "Route similarity", element: <RouteSimilarityPage /> },
  { to: "/dashboard/route-novelty", label: "Route novelty", element: <RouteNoveltyMapPage /> },
  { to: "/dashboard/examples", label: "Analytics fun", element: <ExamplesPage /> },
  { to: "/dashboard/mileage-globe", label: "Mileage Globe", element: <MileageGlobePage /> },
  { to: "/dashboard/fragility", label: "Fragility", element: <FragilityGaugePage /> },
  { to: "/dashboard/session-similarity", label: "Session Similarity", element: <SessionSimilarityMapPage /> },
  { to: "/dashboard/good-day", label: "Good Day", element: <GoodDayMapPage /> },
  { to: "/dashboard/habit-consistency", label: "Habit consistency", element: <HabitConsistencyHeatmapPage /> },
];

export type DashboardRoute = (typeof dashboardRoutes)[number];
