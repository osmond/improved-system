import { render } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import CalendarHeatmap from '../CalendarHeatmap';

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

describe('CalendarHeatmap', () => {
  it('renders heatmap cells', () => {
    const { container } = render(<CalendarHeatmap />);
    const svg = container.querySelector('svg.react-calendar-heatmap');
    expect(svg).not.toBeNull();
  });
});
