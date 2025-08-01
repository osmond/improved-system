import { describe, it, expect } from 'vitest'
import { computeCommuteScore } from '../useCommuteRank'
import type { RouteSession, PaceDistributionBin } from '@/lib/api'

function makeSession(date: string, pace: number): RouteSession {
  const bin: PaceDistributionBin = {
    bin: `${pace}:00`,
    upper: 5,
    lower: 0,
  }
  return { id: 1, route: 'A', date, profile: [], paceDistribution: [bin] }
}

describe('computeCommuteScore', () => {
  it('scores consistent sessions higher', () => {
    const a = [makeSession('2025-07-01', 5), makeSession('2025-07-02', 5)]
    const b = [makeSession('2025-07-01', 5), makeSession('2025-07-10', 7)]
    const scoreA = computeCommuteScore(a)
    const scoreB = computeCommuteScore(b)
    expect(scoreA).toBeGreaterThan(scoreB)
  })
})
