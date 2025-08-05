import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReadingMap from '../ReadingMap';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  CircleMarker: () => null,
}));

describe('ReadingMap', () => {
  it('renders map after fetching data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          { start: '2020-01-01', latitude: 1, longitude: 2, title: 'A' },
        ]),
    });
    render(<ReadingMap />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByTestId('map')).toBeTruthy();
  });
});
