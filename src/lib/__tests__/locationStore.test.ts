import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLocationBaseline,
  updateLocationBaseline,
} from '../locationStore'

describe('locationStore', () => {
  beforeEach(() => localStorage.clear())

  it('persists and updates baseline', () => {
    const first = updateLocationBaseline('user', {
      locationEntropy: 0.5,
      outOfHomeFrequency: 0.4,
    })
    expect(first.locationEntropy).toBeCloseTo(0.5)

    const second = updateLocationBaseline('user', {
      locationEntropy: 0.7,
      outOfHomeFrequency: 0.6,
    })
    expect(second.locationEntropy).toBeCloseTo(0.52, 2)

    const stored = getLocationBaseline('user')
    expect(stored?.outOfHomeFrequency).toBeCloseTo(0.42, 2)
  })
})

