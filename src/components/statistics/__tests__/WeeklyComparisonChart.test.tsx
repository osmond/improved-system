import { render, screen, fireEvent } from '@testing-library/react'
import WeeklyComparisonChart from '../WeeklyComparisonChart'
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
    lastYear: [
      { date: '2024-07-03', value: 6 },
      { date: '2024-07-04', value: 7 },
    ],
  }),
}))

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ width: 400, height: 300, top: 0, left: 0, bottom: 0, right: 0 })
  })
})

describe('WeeklyComparisonChart', () => {
  it('shows all series and summary text', () => {
    render(<WeeklyComparisonChart metric="steps" />)
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Last Week')).toBeInTheDocument()
    expect(screen.getByText('Same Week Last Year')).toBeInTheDocument()
    const lines = document.querySelectorAll('path[stroke^="var(--chart-"]')
    expect(lines.length).toBeGreaterThanOrEqual(3)
    expect(
      screen.getByText("You're 9 miles ahead of 2024-you.")
    ).toBeInTheDocument()
  })
})
