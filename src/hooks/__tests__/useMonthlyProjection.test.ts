import { describe, it, expect, vi } from 'vitest'
import { computeMonthlyStepProjection } from '../useGarminData'
import type { GarminDay } from '@/lib/api'

// helper fixed date

const sampleDays: GarminDay[] = Array.from({length: 15}, (_, i) => ({
  date: `2025-07-${String(i+1).padStart(2,'0')}`,
  steps: 1000,
}))

describe('computeMonthlyStepProjection', () => {
  it('projects totals based on current progress', () => {
    vi.setSystemTime(new Date('2025-07-15'))
    const result = computeMonthlyStepProjection(sampleDays, 1000)
    // July has 31 days -> projected total should equal avg (1000) * 31
    expect(result.projectedTotal).toBe(31000)
    expect(result.goalTotal).toBe(31000)
    expect(result.onTrack).toBe(true)
    vi.useRealTimers()
  })
})
