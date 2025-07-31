import { useMemo } from 'react'
import { useGarminDays, useGarminData } from './useGarminData'

export interface Insights {
  /** Number of consecutive days meeting the step goal */
  activeStreak: number
  /** Current heart rate is unusually high */
  highHeartRate: boolean
  /** Less than 6h sleep last night */
  lowSleep: boolean
  /** Calories exceed typical daily target */
  calorieSurplus: boolean
  /** Fastest pace recorded this month (min/mi) */
  bestPaceThisMonth: number | null
  /** Day of week with most consistent step counts */
  mostConsistentDay: string | null
}

export function useInsights(): Insights | null {
  const days = useGarminDays()
  const data = useGarminData()

  return useMemo(() => {
    if (!days || !data) return null
    const STEP_GOAL = 8000
    let streak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].steps >= STEP_GOAL) streak++
      else break
    }

    const now = new Date()
    const monthActivities =
      data.activities?.filter((a) => {
        const dt = new Date(a.date)
        return (
          dt.getFullYear() === now.getFullYear() &&
          dt.getMonth() === now.getMonth()
        )
      }) ?? []

    const bestPace = monthActivities.length
      ? monthActivities.reduce(
          (min, a) => Math.min(min, a.duration / a.distance),
          Infinity,
        )
      : null

    const byDay: Record<string, number[]> = {}
    for (const d of days) {
      const name = new Date(d.date).toLocaleDateString('en-US', {
        weekday: 'short',
      })
      ;(byDay[name] ||= []).push(d.steps)
    }

    let mostConsistent: string | null = null
    let lowestVar = Infinity
    for (const [dayName, values] of Object.entries(byDay)) {
      if (values.length < 2) continue
      const avg = values.reduce((s, v) => s + v, 0) / values.length
      const variance =
        values.reduce((s, v) => s + (v - avg) * (v - avg), 0) / values.length
      if (variance < lowestVar) {
        lowestVar = variance
        mostConsistent = dayName
      }
    }

    return {
      activeStreak: streak,
      highHeartRate: data.heartRate > 100,
      lowSleep: data.sleep < 6,
      calorieSurplus: data.calories > 2500,
      bestPaceThisMonth: bestPace === Infinity ? null : bestPace,
      mostConsistentDay: mostConsistent,
    }
  }, [days, data])
}

export default useInsights
