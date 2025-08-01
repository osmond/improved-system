import { useEffect, useMemo, useState } from 'react'
import {
  getHourlySteps,
  getWeeklyVolume,
  type HourlySteps,
  type WeeklyVolumePoint,
} from '@/lib/api'
import { computeMovementFingerprint } from './useMovementFingerprint'

function computeAcwr(loads: number[]): number {
  if (!loads.length) return 0
  const last7 = loads.slice(-7)
  const last28 = loads.slice(-28)
  const recent7 = last7.reduce((s, v) => s + v, 0) / last7.length
  const recent28 = last28.reduce((s, v) => s + v, 0) / last28.length
  if (recent28 === 0) return 0
  return recent7 / recent28
}

export interface FragilityIndexResult {
  index: number
  acwr: number
  disruption: number
  monotony: number
}

export function computeFragilityIndex(
  weekly: WeeklyVolumePoint[],
  hours: HourlySteps[],
  weights: {
    disruptionWeight?: number
    acwrWeight?: number
    monotonyWeight?: number
  } = {},
): FragilityIndexResult {
  if (!weekly.length || !hours.length)
    return { index: 0, acwr: 0, disruption: 0, monotony: 0 }

  const loads = weekly.map((w) => w.miles)
  const acwr = computeAcwr(loads)

  const mean = loads.reduce((s, v) => s + v, 0) / loads.length
  const variance =
    loads.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / loads.length
  const sd = Math.sqrt(variance)
  const monotony = mean === 0 ? 0 : 1 / (1 + sd / mean)

  const byDay: Record<string, HourlySteps[]> = {}
  hours.forEach((h) => {
    const day = h.timestamp.slice(0, 10)
    if (!byDay[day]) byDay[day] = []
    byDay[day].push(h)
  })
  const dates = Object.keys(byDay).sort()
  if (dates.length < 2)
    return { index: 0, acwr, disruption: 0 }
  const baselineData = dates.slice(0, -1).flatMap((d) => byDay[d])
  const todayData = byDay[dates[dates.length - 1]]

  const baseline = computeMovementFingerprint(baselineData)
  const today = computeMovementFingerprint(todayData)

  let diff = 0
  let total = 0
  for (let i = 0; i < 24; i++) {
    diff += Math.abs(today[i].steps - baseline[i].steps)
    total += baseline[i].steps
  }
  const disruption = total === 0 ? 0 : diff / total

  const {
    disruptionWeight = 1,
    acwrWeight = 1,
    monotonyWeight = 0,
  } = weights
  const totalWeight = disruptionWeight + acwrWeight + monotonyWeight
  const acwrComponent = Math.max(0, acwr - 1)
  const index =
    totalWeight === 0
      ? 0
      :
        (disruptionWeight * disruption +
          acwrWeight * acwrComponent +
          monotonyWeight * monotony) /
        totalWeight
  const bounded = Math.min(Math.max(index, 0), 1)
  return { index: bounded, acwr, disruption, monotony }
}

export default function useFragilityIndex(): FragilityIndexResult | null {
  const [weekly, setWeekly] = useState<WeeklyVolumePoint[] | null>(null)
  const [hours, setHours] = useState<HourlySteps[] | null>(null)

  useEffect(() => {
    getWeeklyVolume().then(setWeekly)
    getHourlySteps().then(setHours)
  }, [])

  return useMemo(() => {
    if (!weekly || !hours) return null
    return computeFragilityIndex(weekly, hours)
  }, [weekly, hours])
}
