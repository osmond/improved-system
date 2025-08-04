import { describe, it, expect } from 'vitest'
import {
  computeConsistencyScore,
  computeMostConsistentDay,
  computePreferredTrainingHour,
} from '../useTrainingConsistency'
import type { RunningSession } from '@/lib/api'

describe('training consistency metrics', () => {
  const sessions: RunningSession[] = [
    {
      id: 1,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2023-01-02',
      start: '2023-01-02T06:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
    },
    {
      id: 2,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2023-01-09',
      start: '2023-01-09T06:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
    },
    {
      id: 3,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2023-01-03',
      start: '2023-01-03T07:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
    },
  ]

  it('computes consistency score', () => {
    const expected =
      1 -
      (-(
        (2 / 3) * Math.log2(2 / 3) +
        (1 / 3) * Math.log2(1 / 3)
      )) /
        Math.log2(168)
    expect(computeConsistencyScore(sessions)).toBeCloseTo(expected)
  })

  it('finds most consistent day', () => {
    expect(computeMostConsistentDay(sessions)).toBe(1)
  })

  it('finds preferred training hour', () => {
    expect(computePreferredTrainingHour(sessions)).toBe(6)
  })
})
