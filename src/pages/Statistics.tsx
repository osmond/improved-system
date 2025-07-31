"use client"


import {
  AnnualMileage,
  ActivityByTime,
  AvgDailyMileageRadar,
  RunDistances,
  TreadmillVsOutdoor,
  PaceDistribution,
  HeartRateZones,
  PaceVsHR,
  TrainingLoadRatio,
  EquipmentUsageTimeline,
  PerfVsEnvironmentMatrix,
  SessionSimilarityMap,
} from "@/components/statistics"
import PeerBenchmarkBands from "@/components/statistics/PeerBenchmarkBands"
import { ChartSelectionProvider, WeeklyVolumeChart } from "@/components/dashboard"


export default function Statistics() {
  return (
    <ChartSelectionProvider>
      <div className="grid gap-6 p-6">
        <WeeklyVolumeChart />
        <AnnualMileage />
        <ActivityByTime />
        <AvgDailyMileageRadar />
        <RunDistances />
        <TreadmillVsOutdoor />
        <PaceDistribution />
        <HeartRateZones />
        <PaceVsHR />
        <TrainingLoadRatio />
        <EquipmentUsageTimeline />
        <PerfVsEnvironmentMatrix />
        <SessionSimilarityMap />
        <PeerBenchmarkBands />
      </div>
    </ChartSelectionProvider>
  )
}
