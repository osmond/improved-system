import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import RunSoundtrackCard from '../RunSoundtrackCard'

vi.mock('@/hooks/useRunSoundtrack', () => ({
  __esModule: true,
  default: () => ({
    window: { start: '2025-07-30T10:00:00Z', end: '2025-07-30T10:40:00Z' },
    nowPlaying: { item: { name: 'Song A', artists: [{ name: 'Artist' }] } },
    topTracks: [
      { id: '1', name: 'Song A', artists: 'Artist', uri: 'x', playCount: 2 },
      { id: '2', name: 'Song B', artists: 'Other', uri: 'y', playCount: 1 },
    ],
  }),
}))

describe('RunSoundtrackCard', () => {
  it('renders now playing and top tracks', () => {
    render(<RunSoundtrackCard />)
    expect(screen.getByText('Now Playing')).toBeInTheDocument()
    expect(screen.getAllByText(/Song A/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Song B/)).toBeInTheDocument()
  })
})
