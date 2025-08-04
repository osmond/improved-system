import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import SessionDetailDrawer from '../SessionDetailDrawer'
import type { SessionPoint } from '@/hooks/useRunningSessions'
import '@testing-library/jest-dom'

vi.mock('react-map-gl/maplibre', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
  Marker: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/hooks/useSessionTimeseries', () => ({
  __esModule: true,
  default: () => null,
}))

const useRunningSessionsMock = vi.fn()
vi.mock('@/hooks/useRunningSessions', () => ({
  useRunningSessions: () => useRunningSessionsMock(),
}))

const baseSession: SessionPoint = {
  id: 1,
  x: 0,
  y: 0,
  cluster: 0,
  descriptor: 'Clear AM Cluster',
  good: true,
  pace: 6,
  paceDelta: 1.8,
  heartRate: 130,
  confidence: 1,
  temperature: 50,
  humidity: 40,
  wind: -5,
  startHour: 8,
  duration: 30,
  lat: 0,
  lon: 0,
  condition: 'Clear',
  start: '2024-01-01T08:00:00Z',
  tags: [],
  isFalsePositive: false,
  factors: [
    { label: 'Tailwind', impact: 1 },
    { label: 'Stable HR', impact: 0.8 },
  ],
}

describe('SessionDetailDrawer summary', () => {
  it('shows positive factors for good session', () => {
    useRunningSessionsMock.mockReturnValue({ sessions: [baseSession], trend: null, error: null })
    render(<SessionDetailDrawer session={baseSession} onClose={() => {}} />)
    expect(
      screen.getByText('Tailwind + Stable HR led to Δ 1.8 min/mi')
    ).toBeInTheDocument()
  })

  it('shows reason for near-miss', () => {
    const miss: SessionPoint = {
      ...baseSession,
      id: 2,
      good: false,
      paceDelta: -0.3,
      factors: [{ label: 'Heat', impact: -0.4 }],
    }
    useRunningSessionsMock.mockReturnValue({ sessions: [miss], trend: null, error: null })
    render(<SessionDetailDrawer session={miss} onClose={() => {}} />)
    expect(
      screen.getByText('Why not good? Heat added 0.3 min/mi')
    ).toBeInTheDocument()
  })
})
