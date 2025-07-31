"use client"

import { EquipmentUsageTimeline } from "@/components/statistics"

export default function StatisticsExamplesPage() {
  return (
    <div className="space-y-12 px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <EquipmentUsageTimeline />
    </div>
  )
}
