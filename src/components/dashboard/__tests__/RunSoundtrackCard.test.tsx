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
    const { container } = render(<RunSoundtrackCard />)

    // container has simplified styling classes
    expect(container.firstChild).toHaveClass(
      'max-w-sm',
      'rounded-xl',
      'bg-white',
      'border',
      'flex',
    )

    // displays now playing info
    expect(screen.getByText('Now Playing')).toBeInTheDocument()
    expect(screen.getByText('Song A')).toBeInTheDocument()

    // progress bar renders with spotify color and width
    expect(screen.getByRole('progressbar')).toHaveStyle({
      backgroundColor: '#1DB954',
      width: '38%',
    })
  })

  it('shows placeholder when nothing is playing', () => {
    mockHook.mockReturnValue(withoutNowPlaying)
    render(<RunSoundtrackCard />)
    expect(screen.getByText('Not currently listening')).toBeInTheDocument()
  })
})
