import { useState, useEffect } from 'react'
import { getRunningStats, RunningStats } from '@/lib/api'

export function useRunningStats(): RunningStats | null {
  const [data, setData] = useState<RunningStats | null>(null)
  useEffect(() => {
    getRunningStats().then(setData)
  }, [])
  return data
}
