import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
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

vi.mock('@/hooks/useTrainingConsistency', () => ({
  __esModule: true,
  default: () => ({
    sessions: [],
    heatmap: [{ day: 0, hour: 0, count: 1 }],
    weeklyEntropy: [0.2],
  }),
}))

describe('TrainingEntropyHeatmap', () => {
  it('renders chart title', () => {
    render(<TrainingEntropyHeatmap />)
    expect(screen.getByText(/Training Consistency/)).toBeInTheDocument()
  })
})
