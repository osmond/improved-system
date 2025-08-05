import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

const mockData = [
  { date: '2024-01-01', minutes: 5, pages: 2 },
  { date: '2024-01-02', minutes: 10, pages: 4 },
  { date: '2024-02-01', minutes: 20, pages: 8 },
];

vi.mock('@/hooks/useDailyReading', () => ({
  __esModule: true,
  default: () => ({
    data: mockData,
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
    expect(container.querySelector('rect.reading-scale-1')).not.toBeNull();
    expect(container.querySelector('rect.reading-scale-2')).not.toBeNull();
    expect(container.querySelector('rect.reading-scale-4')).not.toBeNull();

    const swatches = legend.querySelectorAll('div');
    expect(swatches.length).toBe(5);
    expect(swatches[0].classList.contains('reading-scale-0')).toBe(true);
    expect(swatches[4].classList.contains('reading-scale-4')).toBe(true);
  });

  it('renders month labels and totals', () => {
    const { getByText } = render(<CalendarHeatmap />);

    const totals = mockData.reduce((acc, { date, minutes }) => {
      const label = new Date(date).toLocaleString('default', { month: 'short' });
      acc[label] = (acc[label] || 0) + minutes;
      return acc;
    }, {});

    Object.entries(totals).forEach(([label, total]) => {
      getByText(label);
      getByText(String(total));
    });
  });

  it('shows tooltip with date, minutes, and sparkline', async () => {
    const user = userEvent.setup();
    const { container } = render(<CalendarHeatmap />);
    const day = container.querySelector('rect[data-date="2024-01-02"]');
    expect(day).not.toBeNull();
    await user.hover(day);
    const dateTexts = await screen.findAllByText('Jan 2, 2024');
    expect(dateTexts.length).toBeGreaterThan(0);
    const minuteTexts = await screen.findAllByText('10 min');
    expect(minuteTexts.length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('sparkline').length).toBeGreaterThan(0);
  });

  it('renders separate heatmaps for each year', () => {
    const twoYearData = [
      { date: '2023-12-31', minutes: 30, pages: 10 },
      { date: '2024-01-01', minutes: 5, pages: 2 },
    ];
    const { container, getByText } = render(
      <CalendarHeatmap data={twoYearData} />
    );
    const svgs = container.querySelectorAll('svg.react-calendar-heatmap');
    expect(svgs.length).toBe(2);
    getByText('2023');
    getByText('2024');

    const [svg2023, svg2024] = svgs;
    expect(svg2023.querySelector('rect.reading-scale-4')).not.toBeNull();
    expect(svg2024.querySelector('rect.reading-scale-1')).not.toBeNull();
  });
});
