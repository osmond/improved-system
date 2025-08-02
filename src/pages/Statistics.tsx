"use client"


import { ChartSelectionProvider } from "@/components/dashboard"
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters"
import { HabitConsistencyHeatmap } from "@/components/statistics"

export default function Statistics() {
  return (
    <DashboardFiltersProvider>
      <ChartSelectionProvider>
        <div className="p-6">
          <HabitConsistencyHeatmap />
        </div>
      </ChartSelectionProvider>
    </DashboardFiltersProvider>
  )
}
