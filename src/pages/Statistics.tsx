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
import { ActivitiesChart, StepsChart } from "@/components/dashboard"
import { SimpleSelect } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useDashboardFilters, { DashboardFiltersProvider } from "@/hooks/useDashboardFilters"


function Filters() {
  const { activity, setActivity, range, setRange } = useDashboardFilters()
  return (
    <div className="flex flex-wrap gap-4 p-6 pt-0">
      <SimpleSelect
        value={range}
        onValueChange={setRange}
        options={[
          { value: '90d', label: 'Last 90 days' },
          { value: '30d', label: 'Last 30 days' },
          { value: '7d', label: 'Last 7 days' },
        ]}
      />
      <Tabs value={activity} onValueChange={setActivity}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="bike">Bike</TabsTrigger>
          <TabsTrigger value="walk">Walk</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
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
