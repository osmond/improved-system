import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import BarChartInteractive from "@/components/examples/BarChartInteractive";

import ChartRadarDefault from "@/components/examples/RadarChartDefault";
import ChartRadialSimple from "@/components/examples/RadialChartSimple";
import ChartRadialLabel from "@/components/examples/RadialChartLabel";
import ChartRadialText from "@/components/examples/RadialChartText";
import ChartBarDefault from "@/components/examples/BarChartDefault";
import ChartRadialGrid from "@/components/examples/RadialChartGrid";
import ChartBarHorizontal from "@/components/examples/BarChartHorizontal";
import ChartPieDonut from "@/components/examples/PieChartDonut";
import ChartRadarDots from "@/components/examples/RadarChartDots";
import ChartBarMixed from "@/components/examples/BarChartMixed";
import ChartBarLabelCustom from "@/components/examples/BarChartLabelCustom";


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

      <ChartBarDefault />
      <ChartRadialGrid />
      <ChartBarHorizontal />
      <ChartPieDonut />
      <ChartRadarDots />
      <ChartBarMixed />
      <ChartBarLabelCustom />

    </div>
  );
}
