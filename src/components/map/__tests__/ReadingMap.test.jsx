import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadingMap from '../ReadingMap';

vi.mock('react-leaflet', () => {
  const LayersControl = ({ children }) => <div>{children}</div>;
  LayersControl.BaseLayer = ({ children }) => <div>{children}</div>;
  return {
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    CircleMarker: () => null,
    LayersControl,
    useMap: () => ({
      setView: () => {},
      addLayer: () => {},
      removeLayer: () => {},
    }),
    useMapEvents: () => ({}),
  };
});

vi.mock('react-leaflet-markercluster', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('leaflet', () => ({
  heatLayer: () => ({ addTo: () => ({}) }),
}));

vi.mock('leaflet.heat', () => ({}));

describe('ReadingMap', () => {
  it('renders map with controls', async () => {
    render(<ReadingMap />);
    await waitFor(() => expect(screen.getByTestId('map')).toBeTruthy());
    expect(screen.getByRole('slider')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
