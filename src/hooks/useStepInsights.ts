import { useMemo } from 'react'
import type { GarminDay } from '@/lib/api'
import { computeMonthlyStepProjection, type MonthlyStepsProjection } from './useGarminData'
import {
  computeMetricInsights,
  type MetricInsights,
  type MetricDay,
} from './useMetricInsights'

export interface StepInsights extends MetricInsights {
  /** Projected totals for the month at current pace */
  monthly: MonthlyStepsProjection
}

export function computeStepInsights(
  days: GarminDay[],
  goalPerDay = 10000,
): StepInsights {
  const metricDays: MetricDay[] = days.map((d) => ({ date: d.date, value: d.steps }))
  const comparisons = computeMetricInsights(metricDays)
  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const monthly = computeMonthlyStepProjection(sorted, goalPerDay)
  return { ...comparisons, monthly }
}

export function useStepInsights(
  days: GarminDay[] | null,
  goalPerDay = 10000,
): StepInsights | null {
  return useMemo(() => {
    if (!days) return null
    return computeStepInsights(days, goalPerDay)
  }, [days, goalPerDay])
}

export default useStepInsights
