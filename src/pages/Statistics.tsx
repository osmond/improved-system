"use client"


import { ChartSelectionProvider } from "@/components/dashboard"
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters"

export default function Statistics() {
  return (
    <DashboardFiltersProvider>
      <ChartSelectionProvider>
        <div className="p-6 text-center text-muted-foreground">
          Statistics charts coming soon...
        </div>
      </ChartSelectionProvider>
    </DashboardFiltersProvider>
  )
}
