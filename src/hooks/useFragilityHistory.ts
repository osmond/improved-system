import { useEffect, useMemo, useState } from 'react'
import { parseISO, startOfISOWeek } from 'date-fns'
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

    function parseWeek(week: string): Date {
      if (/^\d{4}-W\d{2}$/.test(week)) {
        const [yearStr, weekStr] = week.split('-W')
        const year = Number(yearStr)
        const weekNum = Number(weekStr)
        const jan4 = new Date(Date.UTC(year, 0, 4))
        const day = jan4.getUTCDay() || 7
        const start = new Date(jan4)
        start.setUTCDate(jan4.getUTCDate() - day + 1 + (weekNum - 1) * 7)
        return start
      }
      return startOfISOWeek(parseISO(week))
    }

    const weeklySorted = weekly
      .map((w) => ({ ...w, weekDate: parseWeek(w.week) }))
      .sort((a, b) => a.weekDate.getTime() - b.weekDate.getTime())

    const byDay: Record<string, HourlySteps[]> = {}
    hours.forEach((h) => {
      const day = h.timestamp.slice(0, 10)
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(h)
    })
    const dates = Object.keys(byDay).sort()
    const history: FragilityPoint[] = []
    for (let i = 1; i < dates.length; i++) {
      const dateStr = dates[i]
      const dateObj = parseISO(dateStr)
      const weeklyUpTo = weeklySorted
        .filter((w) => w.weekDate <= dateObj)
        .map(({ weekDate, ...rest }) => rest)
      const hoursUpTo = dates.slice(0, i + 1).flatMap((d) => byDay[d])
      const { index } = computeFragilityIndex(weeklyUpTo, hoursUpTo)
      history.push({ date: dateStr, value: index })
    }
    return history.slice(-days)
  }, [weekly, hours, days])
}

