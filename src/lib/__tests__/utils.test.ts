import { describe, expect, it } from 'vitest'
import { generateTrendMessage } from '../utils'

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

describe('generateTrendMessage', () => {
  it('produces deterministic output for a given seed', () => {
    const rand1 = seededRandom(123)
    const rand2 = seededRandom(123)
    const message1 = generateTrendMessage(rand1)
    const message2 = generateTrendMessage(rand2)
    expect(message1).toBe('Trending up by 5.6% this month')
    expect(message1).toBe(message2)
  })

  it('produces different output for different seeds', () => {
    const randA = seededRandom(1)
    const randB = seededRandom(2)
    expect(generateTrendMessage(randA)).not.toBe(
      generateTrendMessage(randB),
    )
  })
})
