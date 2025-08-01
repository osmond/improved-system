import { useEffect, useMemo, useState } from 'react'
import {
  getReadingSessions,
  getActivitySnapshots,
  type ReadingSession,
  type ActivitySnapshot,
} from '@/lib/api'

export interface HeatmapCell {
  day: number
  hour: number
  intensity: number
}

export function computeReadingHeatmap(sessions: ReadingSession[]): HeatmapCell[] {
  const bins = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ total: 0, count: 0 })),
  )
  for (const s of sessions) {
    const d = new Date(s.timestamp)
    const day = d.getDay()
    const hour = d.getHours()
    bins[day][hour].total += s.intensity
    bins[day][hour].count += 1
  }
  const result: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const cell = bins[day][hour]
      result.push({
        day,
        hour,
        intensity: cell.count ? cell.total / cell.count : 0,
      })
    }
  }
  return result
}

export function computeHeatmapFromActivity(
  snaps: ActivitySnapshot[],
): HeatmapCell[] {
  const bins = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ heart: [] as number[], steps: 0 })),
  )
  for (const s of snaps) {
    const d = new Date(s.timestamp)
    const day = d.getDay()
    const hour = d.getHours()
    bins[day][hour].heart.push(s.heartRate)
    bins[day][hour].steps += s.steps
  }
  const stepThreshold = 200
  const hrVarThreshold = 20
  const result: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const cell = bins[day][hour]
      if (cell.heart.length === 0) {
        result.push({ day, hour, intensity: 0 })
        continue
      }
      const mean = cell.heart.reduce((a, b) => a + b, 0) / cell.heart.length
      const variance =
        cell.heart.reduce((a, b) => a + (b - mean) ** 2, 0) / cell.heart.length
      const stepScore = Math.max(0, 1 - cell.steps / stepThreshold)
      const hrScore = Math.max(0, 1 - variance / hrVarThreshold)
      const intensity = Math.min(stepScore, hrScore)
      result.push({ day, hour, intensity })
    }
  }
  return result
}

export default function useReadingHeatmap(): HeatmapCell[] | null {
  const [data, setData] = useState<HeatmapCell[] | null>(null)

  useEffect(() => {
    getReadingSessions().then((sessions) => setData(computeReadingHeatmap(sessions)))
  }, [])

  return data
}

export function useReadingHeatmapFromActivity(): HeatmapCell[] | null {
  const [snaps, setSnaps] = useState<ActivitySnapshot[] | null>(null)

  useEffect(() => {
    getActivitySnapshots().then(setSnaps)
  }, [])

  return useMemo(() => {
    if (!snaps) return null
    return computeHeatmapFromActivity(snaps)
  }, [snaps])
}
