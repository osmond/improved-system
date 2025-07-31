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
import RadarChartWorkoutByTime from "@/components/examples/RadarChartWorkoutByTime";
import ChartBarMixed from "@/components/examples/BarChartMixed";
import ChartBarLabelCustom from "@/components/examples/BarChartLabelCustom";
import ChartTreadmillVsOutdoor from "@/components/examples/TreadmillVsOutdoor";
import { mockDailySteps } from "@/lib/api";
import StepsTrendWithGoal from "@/components/dashboard/StepsTrendWithGoal";


export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />

      <StepsTrendWithGoal data={mockDailySteps} />

      <BarChartInteractive />

      <LineChartInteractive />

      <ChartRadarDefault />
      <RadarChartWorkoutByTime />

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
      <ChartTreadmillVsOutdoor />

    </div>
  );
}
