"use client"


import { ChartSelectionProvider } from "@/components/dashboard"
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters"
import { HabitConsistencyHeatmap, SessionSimilarityMap, RouteSimilarityIndex } from "@/components/statistics"
import { useRunningSessions } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/components/ui/skeleton"

export default function Statistics() {
  const sessions = useRunningSessions()

  return (
    <DashboardFiltersProvider>
      <ChartSelectionProvider>
        <div className="p-6 space-y-6">
          <HabitConsistencyHeatmap />
          {sessions ? (
            <SessionSimilarityMap data={sessions} />
          ) : (
            <Skeleton className="h-64" />
          )}
          <RouteSimilarityIndex />
        </div>
      </ChartSelectionProvider>
    </DashboardFiltersProvider>
  )
}
