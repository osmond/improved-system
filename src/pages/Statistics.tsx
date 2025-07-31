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

import { ActivitiesChart, StepsChart } from "@/components/dashboard"
import { SimpleSelect } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useDashboardFilters, { DashboardFiltersProvider } from "@/hooks/useDashboardFilters"


function Filters() {
  const { activity, setActivity, range, setRange } = useDashboardFilters()
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

export default function Statistics() {
  return (
    <DashboardFiltersProvider>
      <Filters />
      <div className="grid gap-6 p-6 pt-0">
        <AnnualMileage />
        <ActivitiesChart />
        <StepsChart />
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
    </DashboardFiltersProvider>
  )
}
