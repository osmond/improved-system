import { useEffect, useMemo, useState } from 'react'
import { getFocusSessions, type FocusSession } from '@/lib/api'

export interface FocusCircadianBucket {
  hour: number
  label: string
  totalDuration: number
  sessionCount: number
}

export function computeFocusPatterns(sessions: FocusSession[]): FocusCircadianBucket[] {
  const buckets: Record<number, Record<string, { duration: number; count: number }>> = {}
  sessions.forEach((s) => {
    const hour = new Date(s.start).getHours()
    if (!buckets[hour]) buckets[hour] = {}
    if (!buckets[hour][s.label]) buckets[hour][s.label] = { duration: 0, count: 0 }
    buckets[hour][s.label].duration += s.duration
    buckets[hour][s.label].count += 1
  })
  const result: FocusCircadianBucket[] = []
  Object.keys(buckets).forEach((h) => {
    const hour = Number(h)
    Object.keys(buckets[hour]).forEach((label) => {
      const { duration, count } = buckets[hour][label]
      result.push({ hour, label, totalDuration: duration, sessionCount: count })
    })
  })
  return result
}

export default function useFocusPatterns(): FocusCircadianBucket[] | null {
  const [sessions, setSessions] = useState<FocusSession[] | null>(null)
  useEffect(() => {
    getFocusSessions().then(setSessions)
  }, [])
  return useMemo(() => (sessions ? computeFocusPatterns(sessions) : null), [sessions])
}

