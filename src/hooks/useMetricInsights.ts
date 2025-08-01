import { useMemo } from 'react'

export interface MetricDay {
  date: string
  value: number
}

export interface MetricInsights {
  vsYesterday: number
  vs7DayAvg: number
  vsSameDayLastWeek: number
  vs7DayRolling: number
}

export function computeMetricInsights(days: MetricDay[]): MetricInsights {
  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const today = sorted[sorted.length - 1]?.value ?? 0
  const yesterday = sorted.length > 1 ? sorted[sorted.length - 2].value : 0
  const vsYesterday = yesterday === 0 ? 0 : (today - yesterday) / yesterday

  const last7 = sorted.slice(-7).map((d) => d.value)
  const avg7 = last7.length ? last7.reduce((s, v) => s + v, 0) / last7.length : 0
  const vs7DayAvg = avg7 === 0 ? 0 : (today - avg7) / avg7

  const lastWeek = sorted.length > 7 ? sorted[sorted.length - 8].value : 0
  const vsSameDayLastWeek =
    lastWeek === 0 ? 0 : (today - lastWeek) / lastWeek

  const prev7 = sorted.slice(-8, -1).map((d) => d.value)
  const avgPrev7 =
    prev7.length > 0 ? prev7.reduce((s, v) => s + v, 0) / prev7.length : 0
  const avgLast7 =
    last7.length > 0 ? last7.reduce((s, v) => s + v, 0) / last7.length : 0
  const vs7DayRolling = avgPrev7 === 0 ? 0 : (avgLast7 - avgPrev7) / avgPrev7

  return { vsYesterday, vs7DayAvg, vsSameDayLastWeek, vs7DayRolling }
}

export function useMetricInsights(
  days: MetricDay[] | null,
): MetricInsights | null {
  return useMemo(() => {
    if (!days) return null
    return computeMetricInsights(days)
  }, [days])
}

export default useMetricInsights
