import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import ReadingFocusHeatmap from '../ReadingFocusHeatmap'

vi.mock('@/hooks/useReadingHeatmap', () => ({
  __esModule: true,
  default: () => [
    { day: 0, hour: 0, intensity: 0.8 },
  ],
}))

describe('ReadingFocusHeatmap', () => {
  it('renders chart title', () => {
    render(<ReadingFocusHeatmap />)
    expect(screen.getByText(/Reading Focus/)).toBeInTheDocument()
  })
})
