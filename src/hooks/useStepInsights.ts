import { useMemo } from 'react'
import type { GarminDay } from '@/lib/api'
import { computeMonthlyStepProjection, type MonthlyStepsProjection } from './useGarminData'

export interface StepInsights {
  /** Ratio change vs. yesterday (e.g. 0.1 = +10%) */
  vsYesterday: number
  /** Ratio change vs. trailing 7‑day average */
  vs7DayAvg: number
  /** Projected totals for the month at current pace */
  monthly: MonthlyStepsProjection
}

export function computeStepInsights(
  days: GarminDay[],
  goalPerDay = 10000,
): StepInsights {
  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const today = sorted[sorted.length - 1]?.steps ?? 0
  const yesterday = sorted.length > 1 ? sorted[sorted.length - 2].steps : 0
  const vsYesterday = yesterday === 0 ? 0 : (today - yesterday) / yesterday
  const last7 = sorted.slice(-7).map((d) => d.steps)
  const avg7 = last7.length
    ? last7.reduce((sum, v) => sum + v, 0) / last7.length
    : 0
  const vs7DayAvg = avg7 === 0 ? 0 : (today - avg7) / avg7
  const monthly = computeMonthlyStepProjection(sorted, goalPerDay)
  return { vsYesterday, vs7DayAvg, monthly }
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
