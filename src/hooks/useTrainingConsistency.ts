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
  /** Overall schedule consistency on [0,1]; 1.0 means all sessions fall in a single hour slot */
  consistencyScore: number
  /** Day of week (0=Sunday) with the highest session count */
  mostConsistentDay: number
  /** Hour of day (0-23) with the highest session count */
  preferredTrainingHour: number
}

export interface UseTrainingConsistencyResult {
  data: TrainingConsistency | null
  error: Error | null
}

export function filterSessionsByTimeframe(
  sessions: RunningSession[],
  timeframe: string,
): RunningSession[] {
  if (timeframe === 'all') return sessions
  const match = timeframe.match(/(\d+)/)
  if (!match) return sessions
  const days = parseInt(match[1], 10)
  if (isNaN(days)) return sessions
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return sessions.filter((s) => {
    const d = new Date(s.start ?? s.date)
    return d >= cutoff
  })
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

// Consistency score uses Shannon entropy across 168 hourly bins in a week.
// Formula: 1 - H / log2(168), where H is the entropy of session counts.
export function computeConsistencyScore(sessions: RunningSession[]): number {
  const counts = Array(168).fill(0)
  sessions.forEach((s) => {
    const d = new Date(s.start ?? s.date)
    const idx = d.getDay() * 24 + d.getHours()
    counts[idx] += 1
  })
  const entropy = shannonEntropy(counts)
  const maxEntropy = Math.log2(168)
  return maxEntropy ? 1 - entropy / maxEntropy : 0
}

// Returns the day of week (0=Sunday) with the highest session count.
export function computeMostConsistentDay(sessions: RunningSession[]): number {
  const dayCounts = Array(7).fill(0)
  sessions.forEach((s) => {
    const d = new Date(s.start ?? s.date)
    dayCounts[d.getDay()] += 1
  })
  return dayCounts.indexOf(Math.max(...dayCounts))
}

// Returns the hour of day (0-23) with the highest session count.
export function computePreferredTrainingHour(sessions: RunningSession[]): number {
  const hourCounts = Array(24).fill(0)
  sessions.forEach((s) => {
    const d = new Date(s.start ?? s.date)
    hourCounts[d.getHours()] += 1
  })
  return hourCounts.indexOf(Math.max(...hourCounts))
}

export default function useTrainingConsistency(
  timeframe: string = 'all',
): UseTrainingConsistencyResult {
  const [sessions, setSessions] = useState<RunningSession[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getRunningSessions().then(setSessions).catch((e) => setError(e as Error))
  }, [])

  const data = useMemo(() => {
    if (!sessions) return null
    const filtered = filterSessionsByTimeframe(sessions, timeframe)
    return {
      sessions: filtered,
      heatmap: computeHeatmap(filtered),
      weeklyEntropy: computeWeeklyEntropy(filtered),
      consistencyScore: computeConsistencyScore(filtered),
      mostConsistentDay: computeMostConsistentDay(filtered),
      preferredTrainingHour: computePreferredTrainingHour(filtered),
    }
  }, [sessions, timeframe])

  return { data, error }
}
