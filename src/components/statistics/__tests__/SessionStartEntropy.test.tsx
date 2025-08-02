import { render, screen } from '@testing-library/react'
import SessionStartEntropy from '../SessionStartEntropy'
import { vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'

vi.mock('recharts', async () => {
  const actual: any = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    )
  }
})

vi.mock('@/lib/api', () => ({
  getRunningSessions: () =>
    Promise.resolve([
      {
        id: 1,
        pace: 0,
        duration: 0,
        heartRate: 0,
        date: '2025-01-01',
        start: '2025-01-01T10:00:00Z',
        weather: { temperature: 0, humidity: 0, wind: 0, condition: 'Sunny' }
      },
      {
        id: 2,
        pace: 0,
        duration: 0,
        heartRate: 0,
        date: '2025-01-02',
        start: '2025-01-02T12:00:00Z',
        weather: { temperature: 0, humidity: 0, wind: 0, condition: 'Sunny' }
      }
    ])
}))

describe('SessionStartEntropy', () => {
  it('renders chart title', async () => {
    render(<SessionStartEntropy />)
    expect(await screen.findByText(/start time entropy/i)).toBeInTheDocument()
  })
})

