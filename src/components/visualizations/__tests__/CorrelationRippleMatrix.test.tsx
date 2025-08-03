import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import CorrelationRippleMatrix from '../CorrelationRippleMatrix'

vi.mock('recharts', async () => {
  const actual: any = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 200, height: 200 }}>
        {React.cloneElement(children, { width: 200, height: 200 })}
      </div>
    ),
  }
})

describe('CorrelationRippleMatrix', () => {
  it('shows detail chart on cell click', async () => {
    const matrix = [
      [1, 0.5],
      [0.5, 1],
    ]
    const labels = ['A', 'B']
    const drilldown = {
      '0-1': [
        { x: 0, y: 1 },
        { x: 1, y: 2 },
      ],
    }
    const { container } = render(
      <CorrelationRippleMatrix
        matrix={matrix}
        labels={labels}
        drilldown={drilldown}
        cellSize={50}
      />,
    )

    expect(container.querySelector('div.absolute')).not.toBeInTheDocument()

    const cells = container.querySelectorAll('path.recharts-rectangle')
    expect(cells.length).toBeGreaterThan(1)
    await userEvent.click(cells[1] as SVGPathElement, { skipHover: true })
    await waitFor(() =>
      expect(container.querySelector('div.absolute')).toBeInTheDocument(),
    )
  })
})

