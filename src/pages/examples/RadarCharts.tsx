import React from "react";
import ChartRadarDefault from "@/components/examples/RadarChartDefault";
import RadarChartWorkoutByTime from "@/components/examples/RadarChartWorkoutByTime";
import ChartRadarDots from "@/components/examples/RadarChartDots";
import AvgDailyMileageRadar from "@/components/statistics/AvgDailyMileageRadar";

export default function RadarCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartRadarDefault />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <RadarChartWorkoutByTime />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartRadarDots />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <AvgDailyMileageRadar />
      </div>
    </div>
  );
}
