import { useState, useEffect } from 'react'
import { getRunningStats, RunningStats } from '@/lib/api'
import type { ChartRange } from '@/components/dashboard/ChartSelectionContext'

export function useRunningStats(range?: ChartRange): RunningStats | null {
  const [data, setData] = useState<RunningStats | null>(null)
  useEffect(() => {
    getRunningStats(range).then(setData)
  }, [range?.start, range?.end])
  return data
}
