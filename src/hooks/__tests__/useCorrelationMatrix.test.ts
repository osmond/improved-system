import { describe, it, expect } from 'vitest'
import { computeCorrelationMatrix, type MetricPoint } from '../useCorrelationMatrix'

describe('computeCorrelationMatrix', () => {
  it('computes correlations between metrics', () => {
    interface SamplePoint extends MetricPoint {
      a: number
      b: number
      c: number
    }
    const points: SamplePoint[] = [
      { a: 1, b: 2, c: 5 },
      { a: 2, b: 4, c: 4 },
      { a: 3, b: 6, c: 3 },
      { a: 4, b: 8, c: 2 },
      { a: 5, b: 10, c: 1 },
    ]
    const matrix = computeCorrelationMatrix(points)
    expect(matrix.a.a).toBeCloseTo(1)
    expect(matrix.a.b).toBeCloseTo(1)
    expect(matrix.a.c).toBeCloseTo(-1)
    expect(matrix.b.c).toBeCloseTo(-1)
  })

  it('handles uncorrelated data', () => {
    interface SamplePoint extends MetricPoint {
      a: number
      b: number
    }
    const points: SamplePoint[] = [
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 3, b: 2 },
      { a: 4, b: 1 },
      { a: 5, b: 2 },
    ]
    const matrix = computeCorrelationMatrix(points)
    expect(matrix.a.b).toBeCloseTo(0)
    expect(matrix.b.a).toBeCloseTo(0)
  })
})

