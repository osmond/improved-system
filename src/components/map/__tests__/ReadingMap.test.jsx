import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadingMap from '../ReadingMap';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  CircleMarker: () => null,
  useMap: () => ({ setView: () => {} }),
}));

describe('ReadingMap', () => {
  it('renders map with controls', async () => {
    render(<ReadingMap />);
    await waitFor(() => expect(screen.getByTestId('map')).toBeTruthy());
    expect(screen.getByRole('slider')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
