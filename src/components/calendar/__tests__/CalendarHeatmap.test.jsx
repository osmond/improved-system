import { render } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

vi.mock('@/hooks/useDailyReading', () => ({
  __esModule: true,
  default: () => ({
    data: [
      { date: '2024-01-01', minutes: 5, pages: 2 },
      { date: '2024-01-02', minutes: 10, pages: 4 },
    ],
    error: null,
    isLoading: false,
  }),
}));

import CalendarHeatmap from '../CalendarHeatmap';

describe('CalendarHeatmap', () => {
  it('renders heatmap cells', () => {
    const { container } = render(<CalendarHeatmap />);
    const svg = container.querySelector('svg.react-calendar-heatmap');
    expect(svg).not.toBeNull();
  });

  it('renders legend and assigns classes', () => {
    const { container, getByTestId } = render(<CalendarHeatmap />);
    const legend = getByTestId('reading-legend');
    expect(legend).not.toBeNull();

    const rects = container.querySelectorAll('svg.react-calendar-heatmap rect');
    expect(rects[0].classList.contains('reading-scale-2')).toBe(true);
    expect(rects[1].classList.contains('reading-scale-4')).toBe(true);

    const swatches = legend.querySelectorAll('div');
    expect(swatches.length).toBe(5);
    expect(swatches[0].classList.contains('reading-scale-0')).toBe(true);
    expect(swatches[4].classList.contains('reading-scale-4')).toBe(true);
  });
});
