import { render, screen, fireEvent } from '@testing-library/react'
import RunBikeVolumeComparison from '../RunBikeVolumeComparison'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

vi.mock('@/hooks/useRunBikeVolume', () => ({
  __esModule: true,
  default: () => [
    { week: '2025-07-01', runMiles: 10, bikeMiles: 20, runTime: 80, bikeTime: 60 },
    { week: '2025-07-08', runMiles: 12, bikeMiles: 22, runTime: 90, bikeTime: 70 },
  ],
}))

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
})

describe('RunBikeVolumeComparison', () => {
  it('toggles metric', () => {
    render(<RunBikeVolumeComparison />)
    const distanceBtn = screen.getByRole('button', { name: /distance/i })
    const timeBtn = screen.getByRole('button', { name: /time/i })
    expect(distanceBtn).toHaveAttribute('data-active', 'true')
    fireEvent.click(timeBtn)
    expect(timeBtn).toHaveAttribute('data-active', 'true')
  })
})
