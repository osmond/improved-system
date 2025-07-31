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

    return {
      activeStreak: streak,
      highHeartRate: data.heartRate > 100,
      lowSleep: data.sleep < 6,
      calorieSurplus: data.calories > 2500,
    }
  }, [days, data])
}

export default useInsights
