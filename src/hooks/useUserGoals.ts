import { useEffect, useState } from 'react'

export interface UserGoals {
  dailyStepGoal: number
  setDailyStepGoal: (goal: number) => void
  sleepGoal: number
  setSleepGoal: (goal: number) => void
  heartRateGoal: number
  setHeartRateGoal: (goal: number) => void
  calorieGoal: number
  setCalorieGoal: (goal: number) => void
  readingGoal: number
  setReadingGoal: (goal: number) => void
}

export const DEFAULT_DAILY_STEP_GOAL = 10000
export const DEFAULT_SLEEP_GOAL = 8
export const DEFAULT_HEART_RATE_GOAL = 200
export const DEFAULT_CALORIE_GOAL = 3000
export const DEFAULT_READING_GOAL = 300

export function useUserGoals(): UserGoals {
  const [dailyStepGoal, setStepGoal] = useState(DEFAULT_DAILY_STEP_GOAL)
  const [sleepGoal, setSleep] = useState(DEFAULT_SLEEP_GOAL)
  const [heartRateGoal, setHeart] = useState(DEFAULT_HEART_RATE_GOAL)
  const [calorieGoal, setCalories] = useState(DEFAULT_CALORIE_GOAL)
  const [readingGoal, setReading] = useState(DEFAULT_READING_GOAL)

  useEffect(() => {
    const sg = localStorage.getItem('dailyStepGoal')
    if (sg) {
      const parsed = parseInt(sg, 10)
      if (!Number.isNaN(parsed)) setStepGoal(parsed)
    }
    const sl = localStorage.getItem('sleepGoal')
    if (sl) {
      const parsed = parseInt(sl, 10)
      if (!Number.isNaN(parsed)) setSleep(parsed)
    }
    const hg = localStorage.getItem('heartGoal')
    if (hg) {
      const parsed = parseInt(hg, 10)
      if (!Number.isNaN(parsed)) setHeart(parsed)
    }
    const cg = localStorage.getItem('calorieGoal')
    if (cg) {
      const parsed = parseInt(cg, 10)
      if (!Number.isNaN(parsed)) setCalories(parsed)
    }
    const rg = localStorage.getItem('readingGoal')
    if (rg) {
      const parsed = parseInt(rg, 10)
      if (!Number.isNaN(parsed)) setReading(parsed)
    }
  }, [])

  const setDailyStepGoal = (goal: number) => {
    setStepGoal(goal)
    localStorage.setItem('dailyStepGoal', String(goal))
  }

  const setSleepGoal = (goal: number) => {
    setSleep(goal)
    localStorage.setItem('sleepGoal', String(goal))
  }

  const setHeartRateGoal = (goal: number) => {
    setHeart(goal)
    localStorage.setItem('heartGoal', String(goal))
  }

  const setCalorieGoal = (goal: number) => {
    setCalories(goal)
    localStorage.setItem('calorieGoal', String(goal))
  }

  const setReadingGoal = (goal: number) => {
    setReading(goal)
    localStorage.setItem('readingGoal', String(goal))
  }

  return {
    dailyStepGoal,
    setDailyStepGoal,
    sleepGoal,
    setSleepGoal,
    heartRateGoal,
    setHeartRateGoal,
    calorieGoal,
    setCalorieGoal,
    readingGoal,
    setReadingGoal,
  }
}

export default useUserGoals
