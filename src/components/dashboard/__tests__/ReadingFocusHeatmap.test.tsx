import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import ReadingFocusHeatmap from '../ReadingFocusHeatmap'

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

vi.mock('@/hooks/useReadingHeatmap', () => ({
  __esModule: true,
  useReadingHeatmapFromActivity: () => [
    { day: 0, hour: 0, intensity: 0.2 },
  ],
}))

describe('ReadingFocusHeatmap', () => {
  it('renders chart title and intensity labels', () => {
    render(<ReadingFocusHeatmap />)
    expect(screen.getByText(/Reading Focus/)).toBeInTheDocument()
    expect(screen.getByText('Page Turn Panic')).toBeInTheDocument()
  })
})
