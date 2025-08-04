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
  it('shows tooltip on cell focus', async () => {
    const matrix = [
      [1, 0.5],
      [0.5, 1],
    ]
    const labels = ['A', 'B']
    const drilldown = {
      '0-1': {
        data: [
          { x: 0, y: 1 },
          { x: 1, y: 2 },
        ],
        pValue: 0.05,
        insight: 'positive trend',
      },
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

    const cells = container.querySelectorAll('g[tabindex="0"]')
    expect(cells.length).toBeGreaterThan(1)
    const target = cells[1] as SVGGElement
    target.focus()
    await waitFor(() =>
      expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument(),
    )
  })
})

