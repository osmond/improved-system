import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi, describe, it, expect } from 'vitest'
import ReadingStackSplit from '../ReadingStackSplit'

vi.mock('@/hooks/useReadingMediumTotals', () => ({
  __esModule: true,
  default: () => [
    { medium: 'phone', minutes: 30 },
    { medium: 'kindle', minutes: 60 },
  ],
}))

describe('ReadingStackSplit', () => {
  it('renders chart title', () => {
    render(<ReadingStackSplit />)
    expect(screen.getByText(/Reading Stack Split/)).toBeInTheDocument()
  })
})
