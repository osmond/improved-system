import { describe, it, expect } from 'vitest'
import { getFragilityLevel, FRAGILITY_THRESHOLDS } from '../fragility'

describe('getFragilityLevel', () => {
  it('returns low for values below medium threshold', () => {
    expect(getFragilityLevel(0.2).key).toBe('low')
  })

  it('returns medium for values above medium threshold', () => {
    expect(getFragilityLevel(FRAGILITY_THRESHOLDS.medium + 0.01).key).toBe('medium')
  })

  it('returns high for values above high threshold', () => {
    expect(getFragilityLevel(FRAGILITY_THRESHOLDS.high + 0.01).key).toBe('high')
  })

  it('handles boundary values', () => {
    expect(getFragilityLevel(FRAGILITY_THRESHOLDS.medium).key).toBe('low')
    expect(getFragilityLevel(FRAGILITY_THRESHOLDS.high).key).toBe('medium')
  })
})
