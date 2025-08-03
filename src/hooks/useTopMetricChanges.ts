import { useMemo } from 'react'
import useDailyMetric from './useDailyMetric'
import { getDailySteps, getDailySleep, getDailyHeartRate, getDailyCalories, type MetricDay } from '@/lib/api'
import { computeMetricInsights } from './useMetricInsights'

export interface MetricDelta {
  key: string
  label: string
  unit?: string
  value: number
  deltaPct: number
  trend: MetricDay[]
}

export default function useTopMetricChanges(limit = 4): MetricDelta[] | null {
  const steps = useDailyMetric(getDailySteps)
  const sleep = useDailyMetric(getDailySleep)
  const heart = useDailyMetric(getDailyHeartRate)
  const calories = useDailyMetric(getDailyCalories)

  return useMemo(() => {
    const sources = [
      { key: 'steps', label: 'Steps', unit: undefined, data: steps },
      { key: 'sleep', label: 'Sleep', unit: 'h', data: sleep },
      { key: 'heartRate', label: 'Heart rate', unit: 'bpm', data: heart },
      { key: 'calories', label: 'Calories', unit: 'kcal', data: calories },
    ]

    const metrics = sources.flatMap(({ key, label, unit, data }) => {
      if (!data) return []
      const value = data[data.length - 1]?.value ?? 0
      const insights = computeMetricInsights(data)
      return [{
        key,
        label,
        unit,
        value,
        deltaPct: insights.vsYesterday,
        trend: data.slice(-14),
      }]
    })

    if (metrics.length === 0) return null

    return metrics
      .sort((a, b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct))
      .slice(0, limit)
  }, [steps, sleep, heart, calories, limit])
}
