import { render, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import CorrelationRippleMatrix from '../CorrelationRippleMatrix'
import { hsl as d3hsl } from 'd3-color'

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

beforeAll(() => {
  const root = document.documentElement.style
  root.setProperty('--background', '0 0% 100%')
  root.setProperty('--chart-1', '210 100% 45%')
  root.setProperty('--chart-2', '214 90% 50%')
  root.setProperty('--chart-3', '218 80% 55%')
  root.setProperty('--chart-4', '222 70% 60%')
  root.setProperty('--chart-5', '226 60% 65%')
  root.setProperty('--chart-6', '230 70% 50%')
  root.setProperty('--chart-7', '234 80% 55%')
  root.setProperty('--chart-8', '238 90% 60%')
  root.setProperty('--chart-9', '242 80% 65%')
  root.setProperty('--chart-10', '246 70% 70%')
})

describe('CorrelationRippleMatrix', () => {
  it('shows detail panel on cell click', async () => {
    const cell = (v: number) => ({ value: v, n: 10, p: 0.01 })
    const matrix = [
      [cell(1), cell(0.5)],
      [cell(0.5), cell(1)],
    ]
    const labels = ['A', 'B']
    const drilldown = {
      '0-1': {
        seriesX: [
          { time: 0, value: 1 },
          { time: 1, value: 2 },
        ],
        seriesY: [
          { time: 0, value: 2 },
          { time: 1, value: 3 },
        ],
        rolling: [
          { time: 0, value: 0.5 },
          { time: 1, value: 0.6 },
        ],
        breakdown: { weekday: 0.5, weekend: 0.3 },
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

    expect(
      document.querySelector('[data-testid="correlation-details"]'),
    ).not.toBeInTheDocument()

    const cells = container.querySelectorAll('path.recharts-rectangle')
    expect(cells.length).toBeGreaterThan(1)
    fireEvent.click(cells[1] as SVGPathElement)
    await waitFor(() =>
      expect(
        document.querySelector('[data-testid="correlation-details"]'),
      ).toBeInTheDocument(),
    )
  })

  it('uses colorblind palette when specified', () => {
    const cell = (v: number) => ({ value: v, n: 10, p: 0.01 })
    const matrix = [
      [cell(1), cell(-1)],
      [cell(-1), cell(1)],
    ]
    const labels = ['A', 'B']
    const { container } = render(
      <CorrelationRippleMatrix
        matrix={matrix}
        labels={labels}
        palette="colorblind"
        cellSize={50}
      />,
    )

    const legend = container.querySelector('[data-testid="legend-gradient"]') as HTMLDivElement
    const bg = legend.style.background.replace(/\s/g, '')
    const getRgb = (name: string) => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
        .replace(/\s+/g, ', ')
      return d3hsl(`hsl(${v})`).rgb().toString()
    }
    expect(bg).toContain(getRgb('--chart-3'))
    expect(bg).toContain(getRgb('--chart-4'))
  })

  it('supports viridis palette', () => {
    const cell = (v: number) => ({ value: v, n: 10, p: 0.01 })
    const matrix = [
      [cell(1), cell(-1)],
      [cell(-1), cell(1)],
    ]
    const labels = ['A', 'B']
    const { container } = render(
      <CorrelationRippleMatrix
        matrix={matrix}
        labels={labels}
        palette="viridis"
        cellSize={50}
      />, 
    )

    const legend = container.querySelector('[data-testid="legend-gradient"]') as HTMLDivElement
    const bg = legend.style.background.replace(/\s/g, '')
    const getRgb = (name: string) => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
        .replace(/\s+/g, ', ')
      return d3hsl(`hsl(${v})`).rgb().toString()
    }
    expect(bg).toContain(getRgb('--chart-5'))
    expect(bg).toContain(getRgb('--chart-6'))
  })

  it('respects displayMode for lower triangle', () => {
    const cell = (v: number) => ({ value: v, n: 10, p: 0.01 })
    const matrix = [
      [cell(1), cell(0.5)],
      [cell(0.5), cell(1)],
    ]
    const labels = ['A', 'B']
    const { container } = render(
      <CorrelationRippleMatrix
        matrix={matrix}
        labels={labels}
        displayMode="lower"
        cellSize={50}
      />,
    )

    // B vs A cell should not be rendered in lower mode
    const cells = container.querySelectorAll('path.recharts-rectangle')
    expect(cells.length).toBe(3)
    const upperCell = Array.from(cells).find((c) =>
      c.getAttribute('aria-label')?.includes('B vs A'),
    )
    expect(upperCell).toBeUndefined()
  })

  it('dims non-significant correlations', () => {
    const cell = (v: number, p: number) => ({ value: v, n: 10, p })
    const matrix = [
      [cell(1, 0.01), cell(0.2, 0.6)],
      [cell(0.2, 0.6), cell(1, 0.01)],
    ]
    const labels = ['A', 'B']
    const { container } = render(
      <CorrelationRippleMatrix matrix={matrix} labels={labels} cellSize={50} />,
    )
    const cells = container.querySelectorAll('path.recharts-rectangle')
    const target = Array.from(cells).find((c) =>
      c.getAttribute('aria-label')?.includes('0.20'),
    ) as SVGPathElement
    expect(target).toHaveAttribute('opacity', '0.2')
  })
})

