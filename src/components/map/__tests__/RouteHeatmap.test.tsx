import { render, screen } from '@testing-library/react'
import RouteHeatmap from '../RouteHeatmap'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

vi.mock('@/hooks/useRouteHeatmap', () => ({
  useRouteHeatmap: () => [
    { lat: 0, lng: 0, weight: 1, type: 'Run', date: '2025-07-30' }
  ]
}))

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div>tile</div>,
  useMap: () => ({ addLayer: () => {}, removeLayer: () => {} })
}))

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
})

describe('RouteHeatmap', () => {
  it('renders filter selects', () => {
    render(<RouteHeatmap />)
    expect(screen.getAllByLabelText('Activity').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Range').length).toBeGreaterThan(0)
    expect(screen.getByTestId('map')).toBeInTheDocument()
  })
})
