import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

const mockData = [
  { date: '2024-01-01', minutes: 5, pages: 2 },
  { date: '2024-01-02', minutes: 10, pages: 4 },
  { date: '2024-02-01', minutes: 20, pages: 8 },
];

const useDailyReadingMock = vi.hoisted(() =>
  vi.fn(() => ({
    data: mockData,
    error: null,
    isLoading: false,
  }))
);

vi.mock('@/hooks/useDailyReading', () => ({
  __esModule: true,
  default: useDailyReadingMock,
}));

import useDailyReading from '@/hooks/useDailyReading';

import CalendarHeatmap from '../CalendarHeatmap';

describe('CalendarHeatmap', () => {
  it('renders a skeleton while loading', () => {
    useDailyReading.mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
    });
    render(<CalendarHeatmap />);
    expect(screen.getByTestId('calendar-heatmap-skeleton')).not.toBeNull();
  });

  it('renders heatmap cells', () => {
    const { container } = render(<CalendarHeatmap />);
    const svg = container.querySelector('svg.react-calendar-heatmap');
    expect(svg).not.toBeNull();
  });

  it('renders legend and assigns classes', () => {
    const { container, getByTestId } = render(<CalendarHeatmap />);
    const legend = getByTestId('reading-legend');
    expect(legend).not.toBeNull();

    expect(container.querySelector('rect.reading-scale-1')).not.toBeNull();
    const swatches = legend.querySelectorAll('[data-legend-level]');
    expect(swatches.length).toBe(4);
    expect(
      swatches[0].querySelector('div').classList.contains('reading-scale-1')
    ).toBe(true);
    expect(
      swatches[3].querySelector('div').classList.contains('reading-scale-4')
    ).toBe(true);
    expect(legend.querySelector('[data-no-data]')).not.toBeNull();
  });

  it('renders month and quarter boundaries', () => {
    const { container } = render(<CalendarHeatmap />);
    expect(container.querySelector('line.month-boundary')).not.toBeNull();
    expect(container.querySelector('line.quarter-boundary')).not.toBeNull();
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

  it('positions month labels above the grid and totals below', () => {
    const { container } = render(<CalendarHeatmap />);
    const svg = container.querySelector('svg.react-calendar-heatmap');
    expect(svg).not.toBeNull();

    const monthLabelEls = Array.from(svg.querySelectorAll('text')).filter((el) =>
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/.test(
        el.textContent || ''
      )
    );

    const totalEls = Array.from(svg.querySelectorAll('text')).filter((el) =>
      /^\d+$/.test(el.textContent || '')
    );

    const cellHeight = parseFloat(svg.querySelector('rect').getAttribute('height'));
    const heatmapHeight = cellHeight * 7;

    monthLabelEls.forEach((label) => {
      const y = parseFloat(label.getAttribute('y'));
      expect(y).toBeLessThan(0);
    });

    totalEls.forEach((total) => {
      const y = parseFloat(total.getAttribute('y'));
      expect(y).toBeGreaterThan(heatmapHeight);
    });
  });

  it('aligns weeks starting on Monday', () => {
    const { container } = render(<CalendarHeatmap />);
    const monday = container.querySelector('rect[data-date="2024-01-01"]');
    const sunday = container.querySelector('rect[data-date="2024-01-07"]');
    expect(monday).not.toBeNull();
    expect(sunday).not.toBeNull();
    const yMonday = parseFloat(monday.getAttribute('y'));
    const ySunday = parseFloat(sunday.getAttribute('y'));
    expect(yMonday).toBeLessThan(ySunday);
  });

  it('shows tooltip with date, minutes, and sparkline', async () => {
    const user = userEvent.setup();
    const { container } = render(<CalendarHeatmap />);
    const day = container.querySelector('rect[data-date="2024-01-02"]');
    expect(day).not.toBeNull();
    await user.hover(day);
    const tooltip = await screen.findByRole('tooltip');
    within(tooltip).getByText('Jan 2, 2024');
    within(tooltip).getByText('10 min');
    within(tooltip).getByTestId('sparkline');
  });

  it('shows tooltip when interacting with days that have month labels and totals', async () => {
    const user = userEvent.setup();
    const { container, getByText } = render(<CalendarHeatmap />);
    // Ensure month label and total are present
    getByText('Jan');
    getByText('15');

    const day = container.querySelector('rect[data-date="2024-01-01"]');
    expect(day).not.toBeNull();

    await user.hover(day);
    let tooltip = await screen.findByRole('tooltip');
    within(tooltip).getByText('Jan 1, 2024');
    within(tooltip).getByText('5 min');
    await user.unhover(day);

    fireEvent.focus(day);
    tooltip = await screen.findByRole('tooltip');
    within(tooltip).getByText('Jan 1, 2024');
    within(tooltip).getByText('5 min');
  });

  it('dispatches mouseover when clicking a cell', () => {
    const { container } = render(<CalendarHeatmap />);
    const day = container.querySelector('rect[data-date="2024-01-02"]');
    expect(day).not.toBeNull();
    const spy = vi.spyOn(day, 'dispatchEvent');
    fireEvent.click(day);
    expect(
      spy.mock.calls.some(([evt]) => evt.type === 'mouseover')
    ).toBe(true);
  });

  it('shows tooltip when navigating with keyboard', async () => {
    const user = userEvent.setup();
    render(<CalendarHeatmap />);

    const firstCell = screen.getByLabelText('Jan 1, 2024: 5 minutes');
    while (document.activeElement !== firstCell) {
      await user.tab();
    }
    let tooltip = await screen.findByRole('tooltip');
    within(tooltip).getByText('Jan 1, 2024');
    within(tooltip).getByText('5 min');

    await user.tab();
    tooltip = await screen.findByRole('tooltip');
    within(tooltip).getByText('Jan 2, 2024');
    within(tooltip).getByText('10 min');
  });

  it('renders separate heatmaps for each year', () => {
    const twoYearData = [
      { date: '2023-12-31', minutes: 30, pages: 10 },
      { date: '2024-01-01', minutes: 5, pages: 2 },
    ];
    const { container, getByRole } = render(
      <CalendarHeatmap data={twoYearData} />
    );
    const svgs = container.querySelectorAll('svg.react-calendar-heatmap');
    expect(svgs.length).toBe(1);
    getByRole('combobox', { name: /year/i });
  });

  it('can toggle to show all years', async () => {
    const user = userEvent.setup();
    const twoYearData = [
      { date: '2023-12-31', minutes: 30, pages: 10 },
      { date: '2024-01-01', minutes: 5, pages: 2 },
    ];
    const { container, getByText } = render(
      <CalendarHeatmap data={twoYearData} />
    );
    await user.click(screen.getByRole('button', { name: /show all years/i }));
    const svgs = container.querySelectorAll('svg.react-calendar-heatmap');
    expect(svgs.length).toBe(2);
    getByText('2023');
    getByText('2024');
    const [svg2023, svg2024] = svgs;
    expect(svg2023.querySelector('rect.reading-scale-3')).not.toBeNull();
    expect(svg2024.querySelector('rect.reading-scale-1')).not.toBeNull();
  });

  it('defaults to multi-year view when multiYear is true', () => {
    const twoYearData = [
      { date: '2023-12-31', minutes: 30, pages: 10 },
      { date: '2024-01-01', minutes: 5, pages: 2 },
    ];
    const { container, getByRole } = render(
      <CalendarHeatmap data={twoYearData} multiYear />
    );
    const svgs = container.querySelectorAll('svg.react-calendar-heatmap');
    expect(svgs.length).toBe(2);
    getByRole('button', { name: /show selected year/i });
  });
});
