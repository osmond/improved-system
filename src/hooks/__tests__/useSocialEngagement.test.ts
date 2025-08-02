import { describe, it, expect, beforeEach } from 'vitest'
import {
  computeSocialEngagementIndex,
  computeDeviationFlags,
} from '../useSocialEngagement'
import type { LocationVisit } from '@/lib/api'
import { updateLocationBaseline } from '@/lib/locationStore'

const visits: LocationVisit[] = [
  { date: '2025-07-01', placeId: 'home', category: 'home' },
  { date: '2025-07-02', placeId: 'home', category: 'home' },
  { date: '2025-07-02', placeId: 'office', category: 'work' },
  { date: '2025-07-03', placeId: 'cafe', category: 'other' },
  { date: '2025-07-04', placeId: 'home', category: 'home' },
]

describe('computeSocialEngagementIndex', () => {
  it('calculates index and home streak', () => {
    const result = computeSocialEngagementIndex(visits)
    expect(result.index).toBeCloseTo(0.25, 2)
    expect(result.consecutiveHomeDays).toBe(1)
    expect(result.locationEntropy7d).toBeCloseTo(0.25, 2)
  })
})

describe('computeDeviationFlags', () => {
  beforeEach(() => localStorage.clear())

  it('flags significant drops', () => {
    const baseline = { locationEntropy: 0.8, outOfHomeFrequency: 0.8 }
    updateLocationBaseline('test', baseline)
    const current = computeSocialEngagementIndex(visits)
    const flags = computeDeviationFlags(current, baseline)
    expect(flags).toContain('entropy down 69%')
    expect(flags).toContain('out-of-home down 69%')
  })
})
