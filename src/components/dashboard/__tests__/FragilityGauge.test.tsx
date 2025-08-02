import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import '@testing-library/jest-dom'
import FragilityGauge from '../FragilityGauge'

vi.mock('@/hooks/useFragilityIndex', () => ({
  __esModule: true,
  default: () => 0.42,
}))

describe('FragilityGauge', () => {
  it('renders fragility value', () => {
    render(<FragilityGauge />)
    expect(screen.getByText('0.42')).toBeInTheDocument()
  })
})
