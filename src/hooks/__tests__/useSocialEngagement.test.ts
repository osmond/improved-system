import { describe, it, expect } from 'vitest'
import { computeSocialEngagementIndex } from '../useSocialEngagement'
import type { ActivityVisit } from '@/lib/activityContext'

const visits: ActivityVisit[] = [
  { date: '2025-07-01', placeId: 'home', category: 'home', activity: 'sedentary' },
  { date: '2025-07-02', placeId: 'home', category: 'home', activity: 'run' },
  { date: '2025-07-02', placeId: 'office', category: 'work', activity: 'run' },
  { date: '2025-07-03', placeId: 'cafe', category: 'other', activity: 'walk' },
  { date: '2025-07-04', placeId: 'home', category: 'home', activity: 'sedentary' },
]

describe('computeSocialEngagementIndex', () => {
  it('calculates index and home streak', () => {
    const { index, consecutiveHomeDays } = computeSocialEngagementIndex(visits)
    expect(index).toBeCloseTo(0.5, 2)
    expect(consecutiveHomeDays).toBe(0)
  })
})
