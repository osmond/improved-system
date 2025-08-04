import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import TrainingEntropyHeatmap from '../TrainingEntropyHeatmap'

vi.mock('recharts', async () => {
  const actual: any = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    ),
  }
})

vi.mock('@/hooks/useTrainingConsistency')
import useTrainingConsistency from '@/hooks/useTrainingConsistency'
const mockUseTrainingConsistency = useTrainingConsistency as unknown as vi.Mock

beforeEach(() => {
  mockUseTrainingConsistency.mockReturnValue({
    data: {
      sessions: [],
      heatmap: [{ day: 0, hour: 0, count: 1 }],
      weeklyEntropy: [0.2],
    },
    error: null,
  })
})

describe('TrainingEntropyHeatmap', () => {
  it('renders chart title', () => {
    render(<TrainingEntropyHeatmap />)
    expect(screen.getByText(/Training Consistency/)).toBeInTheDocument()
  })

  it('renders error message', () => {
    mockUseTrainingConsistency.mockReturnValueOnce({
      data: null,
      error: new Error('boom'),
    })
    render(<TrainingEntropyHeatmap />)
    expect(
      screen.getByText(/Failed to load training data/),
    ).toBeInTheDocument()
  })
})
