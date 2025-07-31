import { createContext, useContext, useState, ReactNode } from 'react'

export type ActivityType = 'all' | 'run' | 'bike' | 'walk'
export type DateRange = '7d' | '30d' | '90d'

interface DashboardFiltersState {
  activity: ActivityType
  setActivity: (t: ActivityType) => void
  range: DateRange
  setRange: (r: DateRange) => void
}

const DashboardFiltersContext = createContext<DashboardFiltersState | undefined>(undefined)

function useProvideDashboardFilters(): DashboardFiltersState {
  const [activity, setActivity] = useState<ActivityType>('all')
  const [range, setRange] = useState<DateRange>('30d')

  return { activity, setActivity, range, setRange }
}

export function DashboardFiltersProvider({ children }: { children: ReactNode }) {
  const value = useProvideDashboardFilters()
  return <DashboardFiltersContext.Provider value={value}>{children}</DashboardFiltersContext.Provider>
}

export default function useDashboardFilters(): DashboardFiltersState {
  const ctx = useContext(DashboardFiltersContext)
  const fallback = useProvideDashboardFilters()
  return ctx || fallback
}
