import { describe, it, expect, vi } from 'vitest'
import { computeStepInsights } from '../useStepInsights'
import type { GarminDay } from '@/lib/api'

const sampleDays: GarminDay[] = Array.from({ length: 8 }, (_, i) => ({
  date: `2025-07-${String(i + 1).padStart(2, '0')}`,
  steps: i === 7 ? 1100 : 1000,
}))

describe('computeStepInsights', () => {
  it('calculates deltas and projection', () => {
    vi.setSystemTime(new Date('2025-07-08'))
    const result = computeStepInsights(sampleDays, 1000)
    expect(result.vsYesterday).toBeCloseTo(0.1)
    expect(result.vs7DayAvg).toBeCloseTo(0.0845, 3)
    expect(result.vsSameDayLastWeek).toBeCloseTo(0.1)
    expect(result.vs7DayRolling).toBeCloseTo(0.0143, 3)
    expect(result.monthly.projectedTotal).toBeCloseTo(31387.5)
    expect(result.monthly.onTrack).toBe(true)
    vi.useRealTimers()
  })
})
