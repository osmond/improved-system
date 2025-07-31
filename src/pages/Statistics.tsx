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
  RouteComparison,
} from "@/components/statistics"
import PeerBenchmarkBands from "@/components/statistics/PeerBenchmarkBands"

import {
  ChartSelectionProvider,
  WeeklyVolumeChart,
} from "@/components/dashboard"
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters"

export default function Statistics() {
  return (
    <DashboardFiltersProvider>
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
          <RouteComparison route="River Loop" />
          <PeerBenchmarkBands />
        </div>
      </ChartSelectionProvider>
    </DashboardFiltersProvider>
  )
}
