import { render, screen } from '@testing-library/react'
import TimeInBedChart from '../TimeInBedChart'
import '@testing-library/jest-dom'

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ width: 400, height: 300, top: 0, left: 0, bottom: 0, right: 0 })
  })
})

describe('TimeInBedChart', () => {
  it('shows title and reference line', () => {
    render(<TimeInBedChart />)
    expect(screen.getByText(/Time in Bed/i)).toBeInTheDocument()
    const refLine = document.querySelector('line.recharts-reference-line-line')
    expect(refLine).toBeTruthy()
  })
})
