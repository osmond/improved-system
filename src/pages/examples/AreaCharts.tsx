import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import StepsTrendWithGoal from "@/components/dashboard/StepsTrendWithGoal";
import { mockDailySteps } from "@/lib/api";
import AreaChartLoadRatio from "@/components/examples/AreaChartLoadRatio";
import TreadmillVsOutdoorExample from "@/components/examples/TreadmillVsOutdoor";
import WeeklyVolumeHistoryChart from "@/components/examples/WeeklyVolumeHistoryChart";
import GhostSelfRivalChart from "@/components/examples/GhostSelfRivalChart";

export default function AreaCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <AreaChartInteractive />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <StepsTrendWithGoal data={mockDailySteps} />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <AreaChartLoadRatio />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <TreadmillVsOutdoorExample />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <WeeklyVolumeHistoryChart />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <GhostSelfRivalChart />
      </div>
    </div>
  );
}
