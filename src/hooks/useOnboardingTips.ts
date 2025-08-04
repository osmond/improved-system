import { useState, useEffect } from 'react'

export default function useOnboardingTips(key: string, total: number) {
  const storageKey = `onboarding:${key}`
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === 'done') {
        setDone(true)
      }
    } catch {}
  }, [storageKey])

  const next = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1)
    } else {
      try {
        localStorage.setItem(storageKey, 'done')
      } catch {}
      setDone(true)
    }
  }

  return { index: done ? null : index, next, done }
}
