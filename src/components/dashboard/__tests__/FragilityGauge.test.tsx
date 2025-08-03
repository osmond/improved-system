import { render } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import FragilityGauge from '../FragilityGauge'

vi.mock('@/hooks/useFragilityIndex', () => ({
  __esModule: true,
  default: () => ({ index: 0.42, acwr: 1, disruption: 0.2 }),
}))

describe('FragilityGauge', () => {
  it('applies animation attributes', () => {
    const { container } = render(<FragilityGauge />)
    const arc = container.querySelector('svg path:nth-of-type(2)')
    expect(arc).toHaveAttribute('stroke-dashoffset')
    expect(arc).toHaveStyle(
      'transition: stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)'
    )
  })
})
