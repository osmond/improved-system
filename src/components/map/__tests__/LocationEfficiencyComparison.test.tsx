import { render, screen } from '@testing-library/react'
import LocationEfficiencyComparison from '../LocationEfficiencyComparison'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

vi.mock('@/hooks/useLocationEfficiency', () => ({
  __esModule: true,
  default: () => [
    { state: 'CA', city: 'Los Angeles', distance: 10, pace: 8, effort: 80 },
    { state: 'TX', city: 'Austin', distance: 8, pace: 7, effort: 56 },
  ],
}))



describe('LocationEfficiencyComparison', () => {
  it('renders map and ranks locations', () => {
    render(<LocationEfficiencyComparison />)
    expect(screen.getByLabelText(/location map/i)).toBeInTheDocument()
    const ranking = screen.getByLabelText('ranking')
    expect(ranking.textContent?.startsWith('Los Angeles')).toBe(true)
  })
})
