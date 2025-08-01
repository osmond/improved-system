import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import BarChartInteractive from "@/components/examples/BarChartInteractive";
import TimeInBedChart from "@/components/examples/TimeInBedChart";

import ChartRadarDefault from "@/components/examples/RadarChartDefault";
import ChartRadialLabel from "@/components/examples/RadialChartLabel";
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
import BedToRunGauge from "@/components/dashboard/BedToRunGauge";


import ReadingStackSplit from "@/components/dashboard/ReadingStackSplit";
import WildNextGameCard from "@/components/dashboard/WildNextGameCard";
import RunSoundtrackCardDemo from "@/components/examples/RunSoundtrackCardDemo";



export default function Examples() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AreaChartInteractive />

      <StepsTrendWithGoal data={mockDailySteps} />

      <PeerBenchmarkBands />

      <WeeklyVolumeHistoryChart />
      <ReadingProbabilityTimeline />

      <TimeInBedChart />
      <BedToRunGauge />

      <BarChartInteractive />

      <LineChartInteractive />


      <ChartRadarDefault />
      <RadarChartWorkoutByTime />

      <ChartRadialLabel />

      <ChartRadialText />

      <ChartBarDefault />
      <ChartRadialGrid />
      <ChartBarHorizontal />
      <ChartRadarDots />
      <ChartBarMixed />
      <ChartBarLabelCustom />
      <ShoeUsageChart />
      <TreadmillVsOutdoorExample />

      <PerfVsEnvironmentMatrixExample />


      <ScatterChartPaceHeartRate />
      <AreaChartLoadRatio />

      <WildNextGameCard />
      <RunSoundtrackCardDemo />

    </div>
  );
}
