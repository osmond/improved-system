import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import StepsTrendWithGoal from "@/components/dashboard/StepsTrendWithGoal";
import { mockDailySteps } from "@/lib/api";
import AreaChartLoadRatio from "@/components/examples/AreaChartLoadRatio";
import TreadmillVsOutdoorExample from "@/components/examples/TreadmillVsOutdoor";
import WeeklyVolumeHistoryChart from "@/components/examples/WeeklyVolumeHistoryChart";
import GhostSelfRivalChart from "@/components/examples/GhostSelfRivalChart";
import ChartPreview from "@/components/examples/ChartPreview";

export default function AreaCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <ChartPreview>
        <AreaChartInteractive />
      </ChartPreview>
      <ChartPreview>
        <StepsTrendWithGoal data={mockDailySteps} />
      </ChartPreview>
      <ChartPreview>
        <AreaChartLoadRatio />
      </ChartPreview>
      <ChartPreview>
        <TreadmillVsOutdoorExample />
      </ChartPreview>
      <ChartPreview>
        <WeeklyVolumeHistoryChart />
      </ChartPreview>
      <ChartPreview>
        <GhostSelfRivalChart />
      </ChartPreview>
    </div>
  );
}
