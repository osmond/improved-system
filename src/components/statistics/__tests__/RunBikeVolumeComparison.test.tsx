import { render, screen, fireEvent } from '@testing-library/react'
import RunBikeVolumeComparison from '../RunBikeVolumeComparison'
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

vi.mock('@/hooks/useRunBikeVolume', () => ({
  __esModule: true,
  default: () => [
    { week: '2025-07-01', runMiles: 10, bikeMiles: 20, runTime: 80, bikeTime: 60 },
    { week: '2025-07-08', runMiles: 12, bikeMiles: 22, runTime: 90, bikeTime: 70 },
  ],
}))



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
