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


export default function Statistics() {
  return (
    <div className="grid gap-6 p-6">
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
  )
}
