import { render } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import CircularFragilityRing from '../CircularFragilityRing'

vi.mock('@/hooks/useFragilityIndex', () => ({
  __esModule: true,
  default: () => ({ index: 0.42, acwr: 1, disruption: 0.2 }),
}))

describe('CircularFragilityRing', () => {
  it('applies animation attributes', () => {
    const { container } = render(<CircularFragilityRing />)
    const arc = container.querySelector('svg circle:nth-of-type(2)')
    expect(arc).toHaveAttribute('stroke-dashoffset')
    expect(arc).toHaveStyle(
      'transition: stroke-dashoffset 0.5s cubic-bezier(0.34,1.56,0.64,1), stroke 0.5s cubic-bezier(0.34,1.56,0.64,1)'
    )
  })
})
