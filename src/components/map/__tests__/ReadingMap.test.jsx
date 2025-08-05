import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReadingMap from '../ReadingMap';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  CircleMarker: () => null,
}));

describe('ReadingMap', () => {
  it('renders map with locations', async () => {
    render(<ReadingMap />);
    await waitFor(() => expect(screen.getByTestId('map')).toBeTruthy());
  });
});
