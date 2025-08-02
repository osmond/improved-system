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
    const { index, acwr, disruption, monotony } = computeFragilityIndex(
      weekly,
      hours,
    )
    expect(index).toBeCloseTo(0.55, 2)
    expect(acwr).toBeCloseTo(1.1, 1)
    expect(disruption).toBeCloseTo(1, 2)
    expect(monotony).toBeCloseTo(0.85, 2)
  })

  it('applies custom weights', () => {
    const { index } = computeFragilityIndex(weekly, hours, {
      disruptionWeight: 3,
      acwrWeight: 1,
    })
    expect(index).toBeCloseTo(0.78, 2)
  })

  it('includes monotony when weighted', () => {
    const { index } = computeFragilityIndex(weekly, hours, {
      disruptionWeight: 1,
      acwrWeight: 1,
      monotonyWeight: 1,
    })
    expect(index).toBeCloseTo(0.65, 2)
  })
})
