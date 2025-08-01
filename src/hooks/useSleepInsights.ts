import useDailyMetric from './useDailyMetric'
import useMetricInsights, { MetricInsights } from './useMetricInsights'
import { getDailySleep } from '@/lib/api'

export default function useSleepInsights(): MetricInsights | null {
  const days = useDailyMetric(getDailySleep)
  return useMetricInsights(days)
}
