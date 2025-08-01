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
  default: vi.fn(),
  useReadingHeatmapFromActivity: () => [
    { day: 0, hour: 0, intensity: 0.8 },
    { day: 0, hour: 1, intensity: 0.5 },
    { day: 0, hour: 2, intensity: 0.2 },
  ],
}))

describe('ReadingFocusHeatmap', () => {
  it('renders chart title', () => {
    render(<ReadingFocusHeatmap />)
    expect(screen.getByText(/Reading Focus/)).toBeInTheDocument()
    expect(screen.getByLabelText('Deep Dive')).toBeInTheDocument()
    expect(screen.getByLabelText('Skim')).toBeInTheDocument()
    expect(screen.getByLabelText('Page Turn Panic')).toBeInTheDocument()
  })
})
