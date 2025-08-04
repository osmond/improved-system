import React from "react";
import {
  BehavioralWeatherWidget,
  DeltaSpotlightTiles,
  FavoriteVisualizations,
} from "@/components/dashboard";
import useTopMetricChanges from "@/hooks/useTopMetricChanges";

export default function DashboardLanding() {
  const topChanges = useTopMetricChanges();
  return (
    <div className="space-y-6 p-6">
      <FavoriteVisualizations />
      <BehavioralWeatherWidget />
      <DeltaSpotlightTiles metrics={topChanges} />
    </div>
  );
}
