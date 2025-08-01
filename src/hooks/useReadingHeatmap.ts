import { useEffect, useState } from 'react'
import {
  getReadingSessions,
  type ReadingSession,
  getActivitySnapshots,
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
    Array.from({ length: 24 }, () => ({ steps: 0, rates: [] as number[] })),
  )
  for (const s of snaps) {
    const d = new Date(s.timestamp)
    const day = d.getDay()
    const hour = d.getHours()
    bins[day][hour].steps += s.steps
    bins[day][hour].rates.push(s.heartRate)
  }
  const STEP_THRESHOLD = 100
  const HR_VARIANCE = 5
  const result: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const cell = bins[day][hour]
      const stepScore = Math.max(0, 1 - cell.steps / STEP_THRESHOLD)
      const hrRange = cell.rates.length
        ? Math.max(...cell.rates) - Math.min(...cell.rates)
        : 0
      const hrScore = Math.max(0, 1 - hrRange / HR_VARIANCE)
      const intensity = +(Math.min(stepScore, hrScore).toFixed(2))
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
  const [data, setData] = useState<HeatmapCell[] | null>(null)

  useEffect(() => {
    getActivitySnapshots().then((snaps) =>
      setData(computeHeatmapFromActivity(snaps)),
    )
  }, [])

  return data
}
