import { useEffect, useState } from 'react'
import {
  getReadingSessions,
  type ReadingSession,
  type ReadingProbabilityPoint,
} from '@/lib/api'

export function computeReadingProbability(
  sessions: ReadingSession[],
): ReadingProbabilityPoint[] {
  const bins = Array.from({ length: 24 }, () => ({ count: 0, total: 0 }))
  for (const s of sessions) {
    const d = new Date(s.timestamp)
    const hour = d.getHours()
    bins[hour].count += 1
    bins[hour].total += s.intensity
  }
  const totalSessions = sessions.length
  return bins.map((b, i) => {
    const d = new Date()
    d.setHours(i, 0, 0, 0)
    const probability = totalSessions ? b.count / totalSessions : 0
    const intensity = b.count ? b.total / b.count : 0
    return {
      time: d.toISOString(),
      probability,
      intensity,
    }
  })
}

export default function useReadingProbability(): ReadingProbabilityPoint[] | null {
  const [data, setData] = useState<ReadingProbabilityPoint[] | null>(null)

  useEffect(() => {
    getReadingSessions().then((sessions) =>
      setData(computeReadingProbability(sessions)),
    )
  }, [])

  return data
}
