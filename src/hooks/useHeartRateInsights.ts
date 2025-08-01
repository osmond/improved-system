import useDailyMetric from './useDailyMetric'
import useMetricInsights, { MetricInsights } from './useMetricInsights'
import { getDailyHeartRate } from '@/lib/api'

export default function useHeartRateInsights(): MetricInsights | null {
  const days = useDailyMetric(getDailyHeartRate)
  return useMetricInsights(days)
}
