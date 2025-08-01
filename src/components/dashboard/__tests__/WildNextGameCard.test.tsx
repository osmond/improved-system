import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import WildNextGameCard from '../WildNextGameCard'

vi.mock('@/hooks/useWildSchedule', () => ({
  __esModule: true,
  default: () => [
    {
      gameDate: '2025-10-01T00:00:00Z',
      opponent: 'Blues',
      home: true,
      watchUrl: 'https://example.com/watch'
    }
  ]
}))

describe('WildNextGameCard', () => {
  it('renders card title and watch link when schedule is loaded', () => {
    const { container } = render(<WildNextGameCard />)
    expect(screen.getByText('Next Game')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('text-wild-primary')
    const link = screen.getByRole('link', { name: /game details/i })
    expect(link).toHaveAttribute('href', 'https://example.com/watch')
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
