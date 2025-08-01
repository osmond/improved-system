import { render, screen } from '@testing-library/react'
import RouteComparison from '../RouteComparison'
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
