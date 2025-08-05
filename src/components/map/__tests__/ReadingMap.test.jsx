import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import ReadingMap from '../ReadingMap';

vi.mock('react-leaflet', () => {
  const LayersControl = ({ children }) => <div>{children}</div>;
  LayersControl.BaseLayer = ({ children }) => <div>{children}</div>;
  return {
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    CircleMarker: () => null,
    GeoJSON: () => null,
    LayersControl,
    useMap: () => ({
      setView: () => {},
    }),
  };
});

beforeAll(() => {
  const root = document.documentElement.style;
  root.setProperty('--chart-1', '210 100% 45%');
  root.setProperty('--chart-10', '246 70% 70%');
});

describe('ReadingMap', () => {
  it('renders map with controls', async () => {
    render(<ReadingMap />);
    await waitFor(() => expect(screen.getByTestId('map')).toBeTruthy());
    expect(screen.getByRole('slider')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
