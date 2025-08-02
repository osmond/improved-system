import { describe, it, expect, beforeEach } from 'vitest'
import { getSocialBaseline, setSocialBaseline, type SocialBaseline } from '../locationStore'

describe('social baseline persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves baseline', () => {
    const baseline: SocialBaseline = { locationEntropy: 0.5, outOfHomeFrequency: 0.4 }
    setSocialBaseline(baseline)
    expect(getSocialBaseline()).toEqual(baseline)
  })
})
