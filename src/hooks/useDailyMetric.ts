import { useState, useEffect, useMemo } from 'react'
import type { MetricDay } from './useMetricInsights'

export default function useDailyMetric(
  fetcher: () => Promise<MetricDay[]>,
): MetricDay[] | null {
  const [data, setData] = useState<MetricDay[] | null>(null)
  useEffect(() => {
    fetcher().then(setData)
  }, [fetcher])

  return useMemo(() => {
    if (!data) return data
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [data])
}
