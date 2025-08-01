import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import RunSoundtrackCard from '../RunSoundtrackCard'

const mockHook = vi.fn()

vi.mock('@/hooks/useRunSoundtrack', () => ({
  __esModule: true,
  default: () => mockHook(),
}))

const baseData = {
  window: { start: '2025-07-30T10:00:00Z', end: '2025-07-30T10:40:00Z' },
  topTracks: [
    {
      id: '1',
      name: 'Song A',
      artists: 'Artist',
      uri: 'x',
      playCount: 2,
      thumbnail: 'https://via.placeholder.com/40',
    },
    {
      id: '2',
      name: 'Song B',
      artists: 'Other',
      uri: 'y',
      playCount: 1,
      thumbnail: 'https://via.placeholder.com/40',
    },
  ],
}

const withNowPlaying = {
  ...baseData,
  nowPlaying: {
    item: {
      name: 'Song A',
      artists: [{ name: 'Artist' }],
      duration_ms: 240000,
      album: { images: [{ url: 'https://via.placeholder.com/80' }] },
    },
    progress_ms: 90000,
  },
}

const withoutNowPlaying = {
  ...baseData,
  nowPlaying: null,
}

describe('RunSoundtrackCard', () => {
  beforeEach(() => {
    mockHook.mockReset()
  })

  it('renders now playing and top tracks', () => {
    mockHook.mockReturnValue(withNowPlaying)
    const { container } = render(<RunSoundtrackCard />)
    expect(screen.getByText('Now Playing')).toBeInTheDocument()
    expect(screen.getAllByText(/Song A/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Song B/)).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('text-spotify-primary')
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows placeholder when nothing is playing', () => {
    mockHook.mockReturnValue(withoutNowPlaying)
    render(<RunSoundtrackCard />)
    expect(screen.getByText('Not currently listening')).toBeInTheDocument()
  })
})
