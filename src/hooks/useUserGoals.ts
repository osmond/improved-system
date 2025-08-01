import { useEffect, useState } from 'react'

export interface UserGoals {
  dailyStepGoal: number
  setDailyStepGoal: (goal: number) => void
}

export const DEFAULT_DAILY_STEP_GOAL = 10000

export function useUserGoals(): UserGoals {
  const [dailyStepGoal, setGoal] = useState(DEFAULT_DAILY_STEP_GOAL)

  useEffect(() => {
    const stored = localStorage.getItem('dailyStepGoal')
    if (stored) {
      const parsed = parseInt(stored, 10)
      if (!Number.isNaN(parsed)) setGoal(parsed)
    }
  }, [])

  const setDailyStepGoal = (goal: number) => {
    setGoal(goal)
    localStorage.setItem('dailyStepGoal', String(goal))
  }

  return { dailyStepGoal, setDailyStepGoal }
}

export default useUserGoals
