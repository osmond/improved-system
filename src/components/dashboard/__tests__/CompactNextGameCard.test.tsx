import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CompactNextGameCard from '../CompactNextGameCard'

describe('CompactNextGameCard', () => {
  it('renders compact card with props', () => {
    render(
      <CompactNextGameCard
        homeTeam="Wild"
        awayTeam="Blues"
        date="Sep 30, 2025"
        time="7:00 PM"
        isHome={true}
        countdown="in 2 months"
        accentColor="#006847"
      />
    )

    expect(screen.getByRole('heading', { name: /Wild.*vs.*Blues/ })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
