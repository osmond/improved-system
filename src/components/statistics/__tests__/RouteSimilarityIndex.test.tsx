import { render, screen } from '@testing-library/react'
import RouteSimilarityIndex from '../RouteSimilarityIndex'
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
  getMockRoutes: () =>
    Promise.resolve([
      { name: 'A', points: [] },
      { name: 'B', points: [] },
      { name: 'C', points: [] },
    ]),
  calculateRouteSimilarity: vi.fn(() => 0.5),
}))

describe('RouteSimilarityIndex', () => {
  it('renders edges for each route pair', async () => {
    render(<RouteSimilarityIndex />)
    const edges = await screen.findAllByTestId('similarity-edge')
    expect(edges).toHaveLength(3)
  })
})

