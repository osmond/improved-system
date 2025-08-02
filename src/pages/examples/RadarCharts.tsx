import React from "react";
import ChartRadarDefault from "@/components/examples/RadarChartDefault";
import RadarChartWorkoutByTime from "@/components/examples/RadarChartWorkoutByTime";
import ChartRadarDots from "@/components/examples/RadarChartDots";
import AvgDailyMileageRadar from "@/components/statistics/AvgDailyMileageRadar";
import ChartPreview from "@/components/examples/ChartPreview";

export default function RadarCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <ChartPreview>
        <ChartRadarDefault />
      </ChartPreview>
      <ChartPreview>
        <RadarChartWorkoutByTime />
      </ChartPreview>
      <ChartPreview>
        <ChartRadarDots />
      </ChartPreview>
      <ChartPreview>
        <AvgDailyMileageRadar />
      </ChartPreview>
    </div>
  );
}
