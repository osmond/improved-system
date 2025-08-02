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
import ChartPreview from "@/components/examples/ChartPreview";

import PerfVsEnvironmentMatrixExample from "@/components/examples/PerfVsEnvironmentMatrix";

import GhostSelfRivalChart from "@/components/examples/GhostSelfRivalChart";

import WeeklyVolumeHistoryChart from "@/components/examples/WeeklyVolumeHistoryChart";
import ReadingProbabilityTimeline from "@/components/dashboard/ReadingProbabilityTimeline";


import ReadingStackSplit from "@/components/dashboard/ReadingStackSplit";
import CompactNextGameCard from "@/components/dashboard/CompactNextGameCard";
import RunSoundtrackCardDemo from "@/components/examples/RunSoundtrackCardDemo";



export default function Examples() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <ChartPreview>
        <AreaChartInteractive />
      </ChartPreview>

      <ChartPreview>
        <StepsTrendWithGoal data={mockDailySteps} />
      </ChartPreview>

      <ChartPreview>
        <PeerBenchmarkBands />
      </ChartPreview>

      <ChartPreview>
        <GhostSelfRivalChart />
      </ChartPreview>

      <ChartPreview>
        <WeeklyVolumeHistoryChart />
      </ChartPreview>
      <ChartPreview>
        <ReadingProbabilityTimeline />
      </ChartPreview>

      <ChartPreview>
        <TimeInBedChart />
      </ChartPreview>

      <ChartPreview>
        <BarChartInteractive />
      </ChartPreview>

      <ChartPreview>
        <LineChartInteractive />
      </ChartPreview>


      <ChartPreview>
        <ChartRadarDefault />
      </ChartPreview>
      <ChartPreview>
        <RadarChartWorkoutByTime />
      </ChartPreview>

      <ChartPreview>
        <ChartRadialLabel />
      </ChartPreview>

      <ChartPreview>
        <ChartRadialText />
      </ChartPreview>

      <ChartPreview>
        <ChartBarDefault />
      </ChartPreview>
      <ChartPreview>
        <ChartRadialGrid />
      </ChartPreview>
      <ChartPreview>
        <ChartBarHorizontal />
      </ChartPreview>
      <ChartPreview>
        <ChartRadarDots />
      </ChartPreview>
      <ChartPreview>
        <ChartBarMixed />
      </ChartPreview>
      <ChartPreview>
        <ChartBarLabelCustom />
      </ChartPreview>
      <ChartPreview>
        <ShoeUsageChart />
      </ChartPreview>
      <ChartPreview>
        <TreadmillVsOutdoorExample />
      </ChartPreview>

      <ChartPreview>
        <PerfVsEnvironmentMatrixExample />
      </ChartPreview>


      <ChartPreview>
        <ScatterChartPaceHeartRate />
      </ChartPreview>
      <ChartPreview>
        <AreaChartLoadRatio />
      </ChartPreview>

      {/* Minnesota Wild example */}
      <ChartPreview>
        <CompactNextGameCard
          homeTeam="Wild"
          awayTeam="Blues"
          date="Sep 30, 2025"
          time="7:00 PM"
          isHome={true}
          countdown="in 2 months"
          accentColor="#006847"
        />
      </ChartPreview>
      <ChartPreview>
        <RunSoundtrackCardDemo />
      </ChartPreview>

    </div>
  );
}
