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
  topTracks: [],
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

  it('renders now playing details', () => {
    mockHook.mockReturnValue(withNowPlaying)
    render(<RunSoundtrackCard />)

    expect(screen.getByText('Now Playing')).toBeInTheDocument()
    expect(screen.getByText('Song A')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveStyle('background-color: #1DB954')
    expect(screen.queryByText('Top Tracks')).not.toBeInTheDocument()
  })

  it('shows placeholder when nothing is playing', () => {
    mockHook.mockReturnValue(withoutNowPlaying)
    render(<RunSoundtrackCard />)
    expect(screen.getByText('Not currently listening')).toBeInTheDocument()
  })
})
