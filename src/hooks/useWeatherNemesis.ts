import { useMemo } from 'react'
import { useRunningStats } from './useRunningStats'
import type { RunEnvironmentPoint } from '@/lib/api'

export interface WeatherNemesis {
  temperature: number
  humidity: number
  pace: number
}

export function computeWeatherNemesis(
  points: RunEnvironmentPoint[],
): WeatherNemesis | null {
  if (!points.length) return null
  const bins = new Map<string, { total: number; count: number; t: number; h: number }>()
  for (const p of points) {
    const t = Math.round(p.temperature / 5) * 5
    const h = Math.round(p.humidity / 5) * 5
    const key = `${t}-${h}`
    const bin = bins.get(key) || { total: 0, count: 0, t, h }
    bin.total += p.pace
    bin.count += 1
    bins.set(key, bin)
  }
  let worst: WeatherNemesis | null = null
  bins.forEach((b) => {
    const avg = b.total / b.count
    if (!worst || avg > worst.pace) {
      worst = { temperature: b.t, humidity: b.h, pace: avg }
    }
  })
  return worst
}

export default function useWeatherNemesis(): WeatherNemesis | null {
  const stats = useRunningStats()
  return useMemo(() => {
    if (!stats) return null
    return computeWeatherNemesis(stats.paceEnvironment)
  }, [stats])
}
