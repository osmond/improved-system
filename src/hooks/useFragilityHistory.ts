import { useEffect, useMemo, useState } from 'react'
import { getHourlySteps, getWeeklyVolume, type HourlySteps, type WeeklyVolumePoint } from '@/lib/api'
import { computeFragilityIndex } from './useFragilityIndex'

export interface FragilityPoint {
  date: string
  value: number
}

/**
 * Computes historical fragility index values for recent days.
 * Returns an array of points ordered by date ascending.
 */
export default function useFragilityHistory(days = 14): FragilityPoint[] | null {
  const [weekly, setWeekly] = useState<WeeklyVolumePoint[] | null>(null)
  const [hours, setHours] = useState<HourlySteps[] | null>(null)

  useEffect(() => {
    getWeeklyVolume().then(setWeekly)
    getHourlySteps().then(setHours)
  }, [])

  return useMemo(() => {
    if (!weekly || !hours) return null

    const byDay: Record<string, HourlySteps[]> = {}
    hours.forEach((h) => {
      const day = h.timestamp.slice(0, 10)
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(h)
    })
    const dates = Object.keys(byDay).sort()
    const history: FragilityPoint[] = []
    for (let i = 1; i < dates.length; i++) {
      const date = dates[i]
      const weeklyUpTo = weekly.filter((w) => w.week <= date)
      const hoursUpTo = dates.slice(0, i + 1).flatMap((d) => byDay[d])
      const { index } = computeFragilityIndex(weeklyUpTo, hoursUpTo)
      history.push({ date, value: index })
    }
    return history.slice(-days)
  }, [weekly, hours, days])
}

