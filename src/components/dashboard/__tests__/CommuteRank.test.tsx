import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import CommuteRank from '../CommuteRank'

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

vi.mock('@/hooks/useCommuteRank', () => ({
  __esModule: true,
  default: () => [
    { route: 'River Loop', score: 90 },
    { route: 'Park Path', score: 80 },
  ],
}))

vi.mock('@/hooks/useRouteSessions', () => ({
  __esModule: true,
  default: () => [
    { id: 1, route: 'x', date: '2025-07-01', profile: [], paceDistribution: [{ bin: '5:00', upper: 5, lower: 0 }] },
    { id: 2, route: 'x', date: '2025-07-02', profile: [], paceDistribution: [{ bin: '5:00', upper: 5, lower: 0 }] },
  ],
}))

describe('CommuteRank', () => {
  it('renders leaderboard and badge', () => {
    render(<CommuteRank />)
    expect(screen.getByText('Zen Rider')).toBeInTheDocument()
    expect(screen.getByText('River Loop')).toBeInTheDocument()
  })
})
