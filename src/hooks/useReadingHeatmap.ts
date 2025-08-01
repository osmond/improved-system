import { useEffect, useState } from 'react'
import { getReadingSessions, type ReadingSession } from '@/lib/api'

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

export default function useReadingHeatmap(): HeatmapCell[] | null {
  const [data, setData] = useState<HeatmapCell[] | null>(null)

  useEffect(() => {
    getReadingSessions().then((sessions) => setData(computeReadingHeatmap(sessions)))
  }, [])

  return data
}
