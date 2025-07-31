import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import BarChartInteractive from "@/components/examples/BarChartInteractive";

import ChartRadarDefault from "@/components/examples/RadarChartDefault";
import ChartRadialSimple from "@/components/examples/RadialChartSimple";
import ChartRadialLabel from "@/components/examples/RadialChartLabel";
import ChartRadialText from "@/components/examples/RadialChartText";


export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />

      <BarChartInteractive />

      <LineChartInteractive />

      <ChartRadarDefault />

      <ChartRadialSimple />

      <ChartRadialLabel />

      <ChartRadialText />

    </div>
  );
}
