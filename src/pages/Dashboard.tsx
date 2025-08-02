import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarminData } from "@/hooks/useGarminData";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import MileageGlobePage from "@/pages/MileageGlobe";
import {
  FragilityGauge,
  RouteNoveltyMap,
  RouteSimilarity,
} from "@/components/dashboard";
import {
  SessionSimilarityMap,
  GoodDayMap,
  HabitConsistencyHeatmap,
} from "@/components/statistics";
import { useRunningSessions } from "@/hooks/useRunningSessions";


export default function Dashboard() {
  const data = useGarminData();
  const sessions = useRunningSessions();

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    );
  }

  minutesSince(data.lastSync); // retain side-effect-free call for now

  return (
    <Routes>
      <Route
        path="map"
        element={
          <div className="p-6 text-muted-foreground">
            Map playground details coming soon.
          </div>
        }
      />
      <Route path="route-similarity" element={<RouteSimilarity />} />
      <Route path="route-novelty" element={<RouteNoveltyMap />} />
      <Route path="examples" element={<Examples />} />
      <Route path="mileage-globe" element={<MileageGlobePage />} />
      <Route
        path="fragility"
        element={
          <div className="space-y-4 p-4">
            <h3 className="text-lg font-semibold">Fragility index</h3>
            <p className="text-sm text-muted-foreground">
              The fragility index blends training consistency with load spikes to
              estimate injury risk. Lower scores signal resilience, while higher
              scores call for caution.
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-4">
              <li>
                <span className="text-green-600">0–0.33</span>: stable
              </li>
              <li>
                <span className="text-yellow-600">0.34–0.66</span>: monitor
              </li>
              <li>
                <span className="text-red-600">0.67–1.00</span>: high risk
              </li>
            </ul>
            <FragilityGauge />
          </div>
        }
      />
      <Route
        path="session-similarity"
        element={<SessionSimilarityMap data={sessions} />}
      />
      <Route path="good-day" element={<GoodDayMap data={sessions} />} />
      <Route path="habit-consistency" element={<HabitConsistencyHeatmap />} />
      <Route index element={<Navigate to="route-similarity" replace />} />
    </Routes>
  );
}
