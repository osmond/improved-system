import useDailyMetric from './useDailyMetric'
import useMetricInsights, { MetricInsights } from './useMetricInsights'
import { getDailyCalories } from '@/lib/api'

export default function useCalorieInsights(): MetricInsights | null {
  const days = useDailyMetric(getDailyCalories)
  return useMetricInsights(days)
}
