import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import WildNextGameCard from '../WildNextGameCard'

vi.mock('@/hooks/useWildSchedule', () => ({
  __esModule: true,
  default: () => [
    { gameDate: '2025-10-01T00:00:00Z', opponent: 'Blues', home: true }
  ]
}))

describe('WildNextGameCard', () => {
  it('renders card title when schedule is loaded', () => {
    render(<WildNextGameCard />)
    expect(screen.getByText('Next Game')).toBeInTheDocument()
  })
})
