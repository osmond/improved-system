import { useMemo } from 'react'
import type { FragilityPoint } from './useFragilityHistory'

/**
 * Lightweight generator for fragility history preview.
 * Uses cached/randomized stats to avoid heavy computations.
 */
export default function useFragilityPreviewHistory(days = 7): FragilityPoint[] {
  return useMemo(() => {
    const today = new Date()
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (days - 1 - i))
      return { date: d.toISOString().slice(0, 10), value: Math.random() }
    })
  }, [days])
}
