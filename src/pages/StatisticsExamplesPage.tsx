"use client"

import AnnualMileage from "@/components/statistics/AnnualMileage"
import ActivityByTime from "@/components/statistics/ActivityByTime"
import AvgDailyMileageRadar from "@/components/statistics/AvgDailyMileageRadar"
import RunDistances from "@/components/statistics/RunDistances"
import TreadmillVsOutdoor from "@/components/statistics/TreadmillVsOutdoor"
import PaceDistribution from "@/components/statistics/PaceDistribution"
import HeartRateZones from "@/components/statistics/HeartRateZones"
import PaceVsHR from "@/components/statistics/PaceVsHR"
import TrainingLoadRatio from "@/components/statistics/TrainingLoadRatio"
// import TemperatureBreakdown from "./TemperatureBreakdown"
// import WeatherConditions from "./WeatherConditions"

export default function StatisticsExamplesPage() {
  return (
    <div className="space-y-12 px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <AnnualMileage />
        <ActivityByTime />
        <AvgDailyMileageRadar />
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <RunDistances />
        <TreadmillVsOutdoor />
      </div>
      <div className="grid gap-8 md:grid-cols-4">
        <PaceDistribution />
        <HeartRateZones />
        <PaceVsHR />
        <TrainingLoadRatio />
      </div>
      {/* add TemperatureBreakdown and WeatherConditions similarly */}
    </div>
  )
}
