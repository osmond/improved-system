import { render, screen } from '@testing-library/react'
import RouteComparison from '../RouteComparison'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

vi.mock('@/hooks/useRouteSessions', () => ({
  __esModule: true,
  default: () => [
    { id: 1, route: 'Test', date: '2025-07-01', profile: [], paceDistribution: [] },
    { id: 2, route: 'Test', date: '2025-07-02', profile: [], paceDistribution: [] },
  ],
}))



describe('RouteComparison', () => {
  it('renders a chart per session', () => {
    render(<RouteComparison route="Test" />)
    expect(screen.getAllByLabelText(/Session/).length).toBe(2)
  })
})
