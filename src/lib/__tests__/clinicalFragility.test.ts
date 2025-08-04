import { describe, it, expect } from 'vitest'
import { computeFragilityIndex } from '../clinicalFragility'

describe('computeFragilityIndex', () => {
  it('returns 0 for already non-significant tables', () => {
    expect(computeFragilityIndex(10, 90, 15, 85)).toBe(0)
  })

  it('returns 1 when a single flip removes significance', () => {
    expect(computeFragilityIndex(10, 90, 20, 80)).toBe(1)
  })

  it('handles cases requiring multiple flips', () => {
    expect(computeFragilityIndex(1, 99, 10, 90)).toBe(2)
  })

  it('flips the control group when it has fewer events', () => {
    expect(computeFragilityIndex(20, 80, 10, 90)).toBe(1)
  })
})
