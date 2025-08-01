import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NextGameCard from '../NextGameCard'

describe('NextGameCard', () => {
  it('renders with provided props', () => {
    render(
      <NextGameCard
        homeTeam="Wild"
        awayTeam="Blues"
        date="Sep 30, 2025"
        time="7:00 PM"
        location="Xcel Energy Center"
        isHome={true}
        countdown="in 2 months"
        logoUrl="https://via.placeholder.com/40"
        accentColor="#006847"
      />
    )

    expect(screen.getByText('Next Game')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Wild.*vs.*Blues/ })).toBeInTheDocument()
    expect(screen.getByText('Game Details')).toBeInTheDocument()
  })
})
