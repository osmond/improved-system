import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
vi.mock('react-leaflet', () => {
  const LayersControl = ({ children }) => <div>{children}</div>;
  LayersControl.BaseLayer = ({ children }) => <div>{children}</div>;
  return {
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    CircleMarker: ({ children }) => <div data-testid="marker">{children}</div>,
    GeoJSON: () => null,
    Tooltip: ({ children }) => <div>{children}</div>,
    Polyline: () => <div data-testid="polyline" />, 
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
  default: ({ children }) => <div data-testid="cluster">{children}</div>,
}));

vi.mock('../HeatmapLayer', () => ({
  __esModule: true,
  default: () => <div data-testid="heatmap" />,
}));

vi.mock('@/services/locationData', () => ({
  fetchSessionLocations: vi.fn(),
  getSessionLocations: vi.fn(),
}));

import ReadingMap from '../ReadingMap';
import {
  fetchSessionLocations,
  getSessionLocations,
} from '@/services/locationData';

const remoteData = [
  {
    start: '2020-01-01T00:00:00Z',
    title: 'Alpha',
    latitude: 0,
    longitude: 0,
  },
  {
    start: '2021-06-01T00:00:00Z',
    title: 'Beta',
    latitude: 1,
    longitude: 1,
  },
  {
    start: '2022-01-01T00:00:00Z',
    title: 'Gamma',
    latitude: 2,
    longitude: 2,
  },
];

fetchSessionLocations.mockResolvedValue(remoteData);
getSessionLocations.mockReturnValue(remoteData);

describe('ReadingMap', () => {
  it('renders map with controls', async () => {
    render(<ReadingMap />);
    await waitFor(() => expect(screen.getByTestId('map')).toBeTruthy());
    expect(screen.getByRole('slider')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('filters locations by date and title', async () => {
    const { container } = render(<ReadingMap />);
    await waitFor(() => screen.getByTestId('map'));

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 2 } });
    await waitFor(() =>
      expect(screen.getAllByTestId('marker')).toHaveLength(3)
    );

    const dateInputs = container.querySelectorAll('input[type="date"]');
    const [startInput] = dateInputs;
    fireEvent.change(startInput, { target: { value: '2021-01-01' } });
    fireEvent.change(slider, { target: { value: 1 } });
    await waitFor(() =>
      expect(screen.getAllByTestId('marker')).toHaveLength(2)
    );

    const titleSelect = container.querySelectorAll('select')[0];
    fireEvent.change(titleSelect, { target: { value: 'Gamma' } });
    fireEvent.change(slider, { target: { value: 0 } });
    await waitFor(() =>
      expect(screen.getAllByTestId('marker')).toHaveLength(1)
    );
  });

  it('retains sessions on the end date', async () => {
    const { container } = render(<ReadingMap />);
    await waitFor(() => screen.getByTestId('map'));

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 2 } });
    await waitFor(() =>
      expect(screen.getAllByTestId('marker')).toHaveLength(3)
    );

    const dateInputs = container.querySelectorAll('input[type="date"]');
    const [, endInput] = dateInputs;
    fireEvent.change(endInput, { target: { value: '2021-06-01' } });
    fireEvent.change(slider, { target: { value: 1 } });
    await waitFor(() => {
      expect(screen.getAllByTestId('marker')).toHaveLength(2);
      expect(screen.getByText('Beta')).toBeTruthy();
    });
  });

  it('plays through locations when toggling play', async () => {
    render(<ReadingMap />);
    await waitFor(() => screen.getByTestId('map'));

    expect(screen.getAllByTestId('marker')).toHaveLength(1);

    vi.useFakeTimers();
    const button = screen.getByRole('button');
    fireEvent.click(button); // play

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getAllByTestId('marker')).toHaveLength(2);

    fireEvent.click(button); // pause
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getAllByTestId('marker')).toHaveLength(2);
    vi.useRealTimers();
  });

  it('switches map modes', async () => {
    const { container } = render(<ReadingMap />);
    await waitFor(() => screen.getByTestId('map'));

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 2 } });
    await waitFor(() =>
      expect(screen.getAllByTestId('marker')).toHaveLength(3)
    );

    const select = container.querySelectorAll('select')[1];

    fireEvent.change(select, { target: { value: 'markers' } });
    expect(screen.getAllByTestId('marker').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('cluster')).toBeNull();
    expect(screen.queryByTestId('heatmap')).toBeNull();

    fireEvent.change(select, { target: { value: 'cluster' } });
    expect(screen.getByTestId('cluster')).toBeTruthy();
    expect(screen.queryByTestId('heatmap')).toBeNull();

    fireEvent.change(select, { target: { value: 'heatmap' } });
    expect(screen.getByTestId('heatmap')).toBeTruthy();
    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
    expect(screen.queryByTestId('cluster')).toBeNull();
  });

  it('falls back to local data when fetch fails', async () => {
    fetchSessionLocations.mockRejectedValueOnce(new Error('fail'));
    render(<ReadingMap />);
    await waitFor(() => screen.getByTestId('map'));
    expect(getSessionLocations).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByTestId('message').textContent).toContain('local')
    );
  });
});
