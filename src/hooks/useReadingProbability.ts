import { useEffect, useState } from 'react'
import {
  getKindleSessions,
  type KindleSession,
  type ReadingProbabilityPoint,
} from '@/lib/api'

export function computeReadingProbability(
  sessions: KindleSession[],
): ReadingProbabilityPoint[] {
  const bins = Array.from({ length: 24 }, () => ({
    count: 0,
    total: 0,
    duration: 0,
  }))
  for (const s of sessions) {
    const d = new Date(s.start)
    const hour = d.getHours()
    const intensity = s.duration
      ? Math.min(1, (s.highlights || 0) / s.duration)
      : 0
    bins[hour].count += 1
    bins[hour].total += intensity
    bins[hour].duration += s.duration
  }
  const totalSessions = sessions.length
  return bins.map((b, i) => {
    const d = new Date()
    d.setHours(i, 0, 0, 0)
    const probability = totalSessions ? b.count / totalSessions : 0
    const intensity = b.count ? b.total / b.count : 0
    const avgDuration = b.count ? b.duration / b.count : 0
    return {
      time: d.toISOString(),
      probability,
      intensity,
      avgDuration,
      label: labelForIntensity(intensity),
    }
  })
}

function labelForIntensity(intensity: number): string {
  if (intensity > 0.66) return 'Deep Dive'
  if (intensity > 0.33) return 'Skim'
  if (intensity > 0) return 'Page Turn Panic'
  return ''
}

export default function useReadingProbability(): ReadingProbabilityPoint[] | null {
  const [data, setData] = useState<ReadingProbabilityPoint[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    getKindleSessions(signal).then((sessions) => {
      if (!signal.aborted) {
        setData(computeReadingProbability(sessions))
      }
    })
    return () => controller.abort()
  }, [])

  return data
}
