import React from "react";
import { StepsChart } from "./StepsChart";
import { ActivitiesChart } from "./ActivitiesChart";
import WeeklyVolumeChart from "./WeeklyVolumeChart";
import { ChartSelectionProvider } from "./ChartSelectionContext";

export default function DashboardCharts() {
  return (
    <ChartSelectionProvider>
      <div className="grid gap-6 md:grid-cols-2">
        <StepsChart />
        <ActivitiesChart />
        <WeeklyVolumeChart />
      </div>
    </ChartSelectionProvider>
  );
}
