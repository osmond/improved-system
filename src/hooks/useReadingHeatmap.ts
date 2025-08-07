import { useEffect, useMemo, useState } from 'react'
import {
  getKindleSessions,
  getActivitySnapshots,
  type KindleSession,
  type ActivitySnapshot,
} from '@/lib/api'

export interface HeatmapCell {
  day: number
  hour: number
  intensity: number
  /** Degree of fragmentation from 0-1 */
  fragmentation?: number
}

export function computeReadingHeatmap(sessions: KindleSession[]): HeatmapCell[] {
  const bins = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ total: 0, count: 0 })),
  )
  for (const s of sessions) {
    const d = new Date(s.start)
    const day = d.getDay()
    const hour = d.getHours()
    const intensity = s.duration
      ? Math.min(1, (s.highlights || 0) / s.duration)
      : 0
    bins[day][hour].total += intensity
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
    Array.from({ length: 24 }, () => ({
      heart: [] as number[],
      totalSteps: 0,
      appChanges: 0,
      inputCadence: 0,
      locationChanges: 0,
      networkChanges: 0,
      count: 0,
    })),
  )
  const sorted = [...snaps].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
  let prevLocation: string | null = null
  let prevNetwork: string | null = null
  for (const s of sorted) {
    const d = new Date(s.timestamp)
    const day = d.getDay()
    const hour = d.getHours()
    const cell = bins[day][hour]
    cell.heart.push(s.heartRate)
    cell.totalSteps += s.steps
    cell.appChanges += s.appChanges
    cell.inputCadence += s.inputCadence
    if (prevLocation !== null && s.location !== prevLocation) {
      cell.locationChanges += 1
    }
    if (prevNetwork !== null && s.network !== prevNetwork) {
      cell.networkChanges += 1
    }
    prevLocation = s.location
    prevNetwork = s.network
    cell.count += 1
  }
  const stepThreshold = 200
  const hrVarThreshold = 20
  const appChangeThreshold = 3
  const inputCadenceThreshold = 100
  const locationChangeThreshold = 2
  const networkChangeThreshold = 2
  const result: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const cell = bins[day][hour]
      if (cell.heart.length === 0) {
        result.push({ day, hour, intensity: 0, fragmentation: 0 })
        continue
      }
      const mean = cell.heart.reduce((a, b) => a + b, 0) / cell.heart.length
      const variance =
        cell.heart.reduce((a, b) => a + (b - mean) ** 2, 0) / cell.heart.length
      const avgSteps = cell.totalSteps / cell.count
      const stepScore = Math.max(0, 1 - avgSteps / stepThreshold)
      const hrScore = Math.max(0, 1 - variance / hrVarThreshold)
      const avgAppChanges = cell.appChanges / cell.count
      const avgInput = cell.inputCadence / cell.count
      const appScore = Math.max(0, 1 - avgAppChanges / appChangeThreshold)
      const inputScore = Math.min(1, avgInput / inputCadenceThreshold)
      const locScore = Math.max(
        0,
        1 - cell.locationChanges / locationChangeThreshold,
      )
      const netScore = Math.max(
        0,
        1 - cell.networkChanges / networkChangeThreshold,
      )
      const fragmentScore = appScore * inputScore * locScore * netScore
      const intensity = Math.min(stepScore, hrScore) * fragmentScore
      const fragmentation = 1 - fragmentScore
      result.push({ day, hour, intensity, fragmentation })
    }
  }
  return result
}

export default function useReadingHeatmap(): HeatmapCell[] | null {
  const [data, setData] = useState<HeatmapCell[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    getKindleSessions(signal).then((sessions) => {
      if (!signal.aborted) {
        setData(computeReadingHeatmap(sessions))
      }
    })
    return () => controller.abort()
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
