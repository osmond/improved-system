import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import BarChartInteractive from "@/components/examples/BarChartInteractive";

import ChartRadarDefault from "@/components/examples/RadarChartDefault";


export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />

      <BarChartInteractive />

      <LineChartInteractive />

      <ChartRadarDefault />

    </div>
  );
}
