import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import BarChartInteractive from "@/components/examples/BarChartInteractive";
import TimeInBedChart from "@/components/examples/TimeInBedChart";

import ChartRadarDefault from "@/components/examples/RadarChartDefault";
import ChartRadialText from "@/components/examples/RadialChartText";
import ChartBarDefault from "@/components/examples/BarChartDefault";
import ChartRadialGrid from "@/components/examples/RadialChartGrid";
import ChartBarHorizontal from "@/components/examples/BarChartHorizontal";
import ChartRadarDots from "@/components/examples/RadarChartDots";
import RadarChartWorkoutByTime from "@/components/examples/RadarChartWorkoutByTime";
import ChartBarMixed from "@/components/examples/BarChartMixed";
import ChartBarLabelCustom from "@/components/examples/BarChartLabelCustom";
import ShoeUsageChart from "@/components/examples/ShoeUsageChart";
import ScatterChartPaceHeartRate from "@/components/examples/ScatterChartPaceHeartRate";
import AreaChartLoadRatio from "@/components/examples/AreaChartLoadRatio";
import TreadmillVsOutdoorExample from "@/components/examples/TreadmillVsOutdoor";
import { mockDailySteps } from "@/lib/api";
import StepsTrendWithGoal from "@/components/dashboard/StepsTrendWithGoal";
import PeerBenchmarkBands from "@/components/statistics/PeerBenchmarkBands";

import PerfVsEnvironmentMatrixExample from "@/components/examples/PerfVsEnvironmentMatrix";

import WeeklyVolumeHistoryChart from "@/components/examples/WeeklyVolumeHistoryChart";
import ReadingProbabilityTimeline from "@/components/dashboard/ReadingProbabilityTimeline";
import ReadingStackSplit from "@/components/dashboard/ReadingStackSplit";


export default function Examples() {
  return (
    <div className="space-y-8">
      {/* Overview / Summary */}
      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Overview / Summary
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ChartRadialText />
          <ChartRadialGrid />
          <AreaChartInteractive />
          <TimeInBedChart />
          <ReadingProbabilityTimeline />
          <ReadingStackSplit />
        </div>
      </section>

      {/* Performance & Efficiency */}
      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Performance & Efficiency
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <LineChartInteractive />
          <StepsTrendWithGoal data={mockDailySteps} />
          <PeerBenchmarkBands />
          <ScatterChartPaceHeartRate />
          <AreaChartLoadRatio />
          <PerfVsEnvironmentMatrixExample />
        </div>
      </section>

      {/* Habits & Context */}
      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Habits & Context
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RadarChartWorkoutByTime />
          <ChartRadarDots />
          <ChartBarLabelCustom />
          <TreadmillVsOutdoorExample />
          <ChartBarHorizontal />
          <ChartBarDefault />
          <ChartBarMixed />
          <ShoeUsageChart />
        </div>
      </section>

      {/* Balance / Narrative / Novelty */}
      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Balance / Narrative / Novelty
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Add mind+body fusion charts here when available */}
        </div>
      </section>

      {/* History / Supporting */}
      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          History / Supporting
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <WeeklyVolumeHistoryChart />
          <ChartRadarDefault />
          <BarChartInteractive />
        </div>
      </section>
    </div>
  );
}
