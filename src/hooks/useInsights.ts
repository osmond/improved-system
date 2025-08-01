import { useEffect, useMemo, useState } from 'react'
import { useGarminDays, useGarminData } from './useGarminData'
import useUserGoals from './useUserGoals'
import { getRunningSessions, type RunningSession } from '@/lib/api'

export interface Insights {
  /** Number of consecutive days meeting the step goal */
  activeStreak: number
  /** Current heart rate is unusually high */
  highHeartRate: boolean
  /** Less than 6h sleep last night */
  lowSleep: boolean
  /** Calories exceed typical daily target */
  calorieSurplus: boolean
  /** Fastest pace recorded this month in min/mile */
  bestPaceThisMonth: number | null
  /** Day of week with most runs this month */
  mostConsistentDay: string | null
  /** Steps and heart rate indicate low-activity day */
  quietDay: boolean
}

export function useInsights(): Insights | null {
  const days = useGarminDays()
  const data = useGarminData()
  const { dailyStepGoal } = useUserGoals()
  const [sessions, setSessions] = useState<RunningSession[] | null>(null)

  useEffect(() => {
    getRunningSessions().then(setSessions)
  }, [])

  return useMemo(() => {
    if (!days || !data || !sessions) return null
    const STEP_GOAL = dailyStepGoal
    let streak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].steps >= STEP_GOAL) streak++
      else break
    }

    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const monthly = sessions.filter((s) => {
      const d = new Date(s.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    const bestPace = monthly.length
      ? Math.min(...monthly.map((s) => s.pace))
      : null
    const counts = Array.from({ length: 7 }, () => 0)
    monthly.forEach((s) => {
      counts[new Date(s.date).getDay()]++
    })
    const maxCount = Math.max(...counts)
    const dayIndex = counts.findIndex((c) => c === maxCount)
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const consistentDay = maxCount > 0 ? dayNames[dayIndex] : null

    const todaySteps = days.at(-1)?.steps ?? 0
    const quietDay = todaySteps < 2000 && data.heartRate < 60

    return {
      activeStreak: streak,
      highHeartRate: data.heartRate > 100,
      lowSleep: data.sleep < 6,
      calorieSurplus: data.calories > 2500,
      bestPaceThisMonth: bestPace,
      mostConsistentDay: consistentDay,
      quietDay,
    }
  }, [days, data, sessions, dailyStepGoal])
}

export default useInsights
