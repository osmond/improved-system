import { useEffect, useMemo, useState } from 'react'
import { getRunningSessions, type RunningSession } from '@/lib/api'

export interface TrainingHeatmapCell {
  day: number
  hour: number
  count: number
}

export interface TrainingConsistency {
  sessions: RunningSession[]
  heatmap: TrainingHeatmapCell[]
  weeklyEntropy: number[]
}

export interface UseTrainingConsistencyResult {
  data: TrainingConsistency | null
  error: Error | null
}

function computeHeatmap(sessions: RunningSession[]): TrainingHeatmapCell[] {
  const bins = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0))
  sessions.forEach((s) => {
    const d = new Date(s.start ?? s.date)
    const day = d.getDay()
    const hour = d.getHours()
    bins[day][hour] += 1
  })
  const result: TrainingHeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      result.push({ day, hour, count: bins[day][hour] })
    }
  }
  return result
}

function shannonEntropy(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0)
  if (!total) return 0
  return -counts.reduce((sum, c) => {
    if (!c) return sum
    const p = c / total
    return sum + p * Math.log2(p)
  }, 0)
}

function computeWeeklyEntropy(sessions: RunningSession[]): number[] {
  const weeks: Record<string, number[]> = {}
  sessions.forEach((s) => {
    const d = new Date(s.start ?? s.date)
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - d.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const key = weekStart.toISOString().slice(0, 10)
    if (!weeks[key]) weeks[key] = Array(168).fill(0)
    const idx = d.getDay() * 24 + d.getHours()
    weeks[key][idx] += 1
  })
  return Object.keys(weeks)
    .sort()
    .map((k) => shannonEntropy(weeks[k]))
}

export default function useTrainingConsistency(): UseTrainingConsistencyResult {
  const [sessions, setSessions] = useState<RunningSession[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getRunningSessions().then(setSessions).catch((e) => setError(e as Error))
  }, [])

  const data = useMemo(() => {
    if (!sessions) return null
    return {
      sessions,
      heatmap: computeHeatmap(sessions),
      weeklyEntropy: computeWeeklyEntropy(sessions),
    }
  }, [sessions])

  return { data, error }
}
