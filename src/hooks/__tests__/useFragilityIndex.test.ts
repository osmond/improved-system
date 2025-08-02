import { describe, it, expect } from 'vitest'
import { computeFragilityIndex } from '../useFragilityIndex'
import type { WeeklyVolumePoint, HourlySteps } from '@/lib/api'

const weekly: WeeklyVolumePoint[] = Array.from({ length: 28 }, (_, i) => ({
  week: `2025-W${i}`,
  miles: i === 27 ? 20 : 10,
}))

const baselineDay: HourlySteps[] = Array.from({ length: 24 }, (_, h) => ({
  timestamp: `2025-07-29T${String(h).padStart(2,'0')}:00:00Z`,
  steps: 100,
}))
const todayDay: HourlySteps[] = Array.from({ length: 24 }, (_, h) => ({
  timestamp: `2025-07-30T${String(h).padStart(2,'0')}:00:00Z`,
  steps: 200,
}))

const hours = [...baselineDay, ...todayDay]

describe('computeFragilityIndex', () => {
  it('returns index with components', () => {
    const { index, acwr, disruption } = computeFragilityIndex(weekly, hours)
    expect(index).toBeCloseTo(0.55, 2)
    expect(acwr).toBeCloseTo(1.1, 1)
    expect(disruption).toBeCloseTo(1, 2)
  })
})
