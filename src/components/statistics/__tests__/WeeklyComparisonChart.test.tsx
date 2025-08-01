import { render, screen, fireEvent } from '@testing-library/react'
import WeeklyComparisonChart from '../WeeklyComparisonChart'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

vi.mock('@/hooks/useWeeklyComparison', () => ({
  __esModule: true,
  default: () => ({
    current: [
      { date: '2025-07-01', value: 10 },
      { date: '2025-07-02', value: 12 },
    ],
    previous: [
      { date: '2025-06-24', value: 8 },
      { date: '2025-06-25', value: 9 },
    ],
    lastYear: [],
  }),
}))

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ width: 400, height: 300, top: 0, left: 0, bottom: 0, right: 0 })
  })
})

describe('WeeklyComparisonChart', () => {
  it('shows both series and tooltip labels', () => {
    render(<WeeklyComparisonChart metric="steps" />)
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Last Week')).toBeInTheDocument()
    const lines = document.querySelectorAll('path[stroke^="hsl(var(--chart-"]')
    expect(lines.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Last Week')).toBeInTheDocument()
  })
})
