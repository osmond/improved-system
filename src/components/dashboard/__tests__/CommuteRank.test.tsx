import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import '@testing-library/jest-dom'
import CommuteRank from '../CommuteRank'

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
