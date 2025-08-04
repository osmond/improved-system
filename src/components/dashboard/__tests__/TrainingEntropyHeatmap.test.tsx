import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
      sessions: [
        {
          id: 1,
          pace: 5,
          duration: 30,
          heartRate: 120,
          date: '2023-01-01',
          start: '2023-01-01T00:00:00',
          lat: 0,
          lon: 0,
          weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
        },
      ],
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

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<TrainingEntropyHeatmap />)
    const cell = screen.getByLabelText('Sun hour 0: 1 sessions')
    await user.hover(cell)
    expect(
      await screen.findByText('1 sessions on Sun at 00:00'),
    ).toBeInTheDocument()
  })

  it('opens dialog with sessions on click', async () => {
    const user = userEvent.setup()
    render(<TrainingEntropyHeatmap />)
    const cell = screen.getByLabelText('Sun hour 0: 1 sessions')
    await user.click(cell)
    expect(screen.getByText('Session 1')).toBeInTheDocument()
  })
})
