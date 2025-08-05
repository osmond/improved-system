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
    CircleMarker: ({ children }) => <div>{children}</div>,
    GeoJSON: () => null,
    Tooltip: ({ children }) => <div>{children}</div>,
    LayersControl,
    useMap: () => ({
      setView: () => {},
      on: () => {},
      off: () => {},
      getZoom: () => 5,
    }),
  };
});

vi.mock('leaflet', () => {
  const control = () => ({
    onAdd: () => {},
    addTo: () => {},
    remove: () => {},
  });
  const DomUtil = {
    create: () => ({ style: {}, innerHTML: '' }),
  };
  return { __esModule: true, default: { control, DomUtil } };
});

vi.mock('react-leaflet-markercluster', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../HeatmapLayer', () => ({
  __esModule: true,
  default: () => null,
}));

describe('ReadingMap', () => {
  it('renders map with controls', async () => {
    render(<ReadingMap />);
    await waitFor(() => expect(screen.getByTestId('map')).toBeTruthy());
    expect(screen.getByRole('slider')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
