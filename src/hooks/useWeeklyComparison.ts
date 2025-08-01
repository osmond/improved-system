import { useEffect, useState } from 'react'
import {
  WeeklyMetricPoint,
  getCurrentWeek,
  getPreviousWeek,
  getSameWeekLastYear,
} from '@/lib/api'

export interface WeeklyComparisonData {
  current: WeeklyMetricPoint[]
  previous: WeeklyMetricPoint[]
  lastYear: WeeklyMetricPoint[]
}

export default function useWeeklyComparison(
  metric: string,
): WeeklyComparisonData | null {
  const [data, setData] = useState<WeeklyComparisonData | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([
      getCurrentWeek(metric),
      getPreviousWeek(metric),
      getSameWeekLastYear(metric),
    ]).then(([current, previous, lastYear]) => {
      if (active) setData({ current, previous, lastYear })
    })
    return () => {
      active = false
    }
  }, [metric])

  return data
}
