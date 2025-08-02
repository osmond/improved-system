import React from "react";
import ChartRadialLabel from "@/components/examples/RadialChartLabel";
import ChartRadialText from "@/components/examples/RadialChartText";
import ChartRadialGrid from "@/components/examples/RadialChartGrid";

export default function RadialCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartRadialLabel />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartRadialText />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartRadialGrid />
      </div>
    </div>
  );
}
