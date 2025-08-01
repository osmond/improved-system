import { render, screen } from '@testing-library/react'
import LocationEfficiencyComparison from '../LocationEfficiencyComparison'
import { vi } from 'vitest'
import React from 'react'
vi.mock('react-map-gl/maplibre', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Source: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Layer: () => null,
  Marker: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
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
