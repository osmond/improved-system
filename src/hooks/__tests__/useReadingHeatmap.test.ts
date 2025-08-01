import { describe, it, expect } from 'vitest'
import { computeReadingHeatmap } from '../useReadingHeatmap'
import type { ReadingSession } from '@/lib/api'

describe('computeReadingHeatmap', () => {
  it('bins by hour and weekday', () => {
    const sessions: ReadingSession[] = [
      { timestamp: '2025-07-28T10:00:00Z', intensity: 0.5 },
      { timestamp: '2025-07-28T10:30:00Z', intensity: 0.7 },
      { timestamp: '2025-07-29T11:00:00Z', intensity: 0.2 },
    ]
    const result = computeReadingHeatmap(sessions)
    expect(result.length).toBe(168)
    const mon10 = result.find((c) => c.day === 1 && c.hour === 10)
    const tue11 = result.find((c) => c.day === 2 && c.hour === 11)
    expect(mon10?.intensity).toBeCloseTo(0.6)
    expect(tue11?.intensity).toBeCloseTo(0.2)
  })
})
