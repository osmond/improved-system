import { describe, it, expect } from 'vitest'
import {
  computeSocialEngagementIndex,
  computeDeviationFlags,
} from '../useSocialEngagement'
import type { LocationVisit } from '@/lib/api'

const visits: LocationVisit[] = [
  { date: '2025-07-01', placeId: 'home', category: 'home' },
  { date: '2025-07-02', placeId: 'home', category: 'home' },
  { date: '2025-07-02', placeId: 'office', category: 'work' },
  { date: '2025-07-03', placeId: 'cafe', category: 'other' },
  { date: '2025-07-04', placeId: 'home', category: 'home' },
]

describe('computeSocialEngagementIndex', () => {
  it('calculates index and home streak', () => {
    const { index, consecutiveHomeDays } = computeSocialEngagementIndex(visits)
    expect(index).toBeCloseTo(0.56, 2)
    expect(consecutiveHomeDays).toBe(1)
  })

  it('flags large deviations', () => {
    const metrics = computeSocialEngagementIndex(visits)
    const baseline = {
      entropy: metrics.locationEntropy * 2,
      outOfHome: metrics.outOfHomeFrequency * 2,
    }
    const flags = computeDeviationFlags(
      {
        locationEntropy: metrics.locationEntropy,
        outOfHomeFrequency: metrics.outOfHomeFrequency,
      },
      baseline,
    )
    expect(flags).toContain('entropy down 50%')
    expect(flags).toContain('out-of-home down 50%')
  })
})
