import { describe, it, expect } from 'vitest'
import { generateMockWeeklyVolumeHistory } from '../api'

describe('generateMockWeeklyVolumeHistory', () => {
  it('creates 20 years of weekly data by default', () => {
    const data = generateMockWeeklyVolumeHistory()
    expect(data).toHaveLength(20 * 52)
  })
})
