import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { select } from 'd3-selection';
import { act } from 'react';
import ReadingTimeline from '../ReadingTimeline.jsx';

const sessions = [
  {
    start: '2025-01-01T00:00:00Z',
    end: '2025-01-01T00:30:00Z',
    asin: 'B001',
    title: 'Test Book 1',
    duration: 20,
    highlights: 2,
    genre: 'Mystery',
  },
  {
    start: '2025-01-01T00:30:00Z',
    end: '2025-01-01T01:00:00Z',
    asin: 'B002',
    title: 'Test Book 2',
    duration: 40,
    highlights: 1,
    genre: 'Fantasy',
  },
];

const overlapping = [
  {
    start: '2025-01-01T00:00:00Z',
    end: '2025-01-01T00:30:00Z',
    asin: 'B001',
    title: 'Overlap 1',
    duration: 20,
    highlights: 1,
    genre: 'Mystery',
  },
  {
    start: '2025-01-01T00:15:00Z',
    end: '2025-01-01T00:45:00Z',
    asin: 'B001',
    title: 'Overlap 2',
    duration: 25,
    highlights: 3,
    genre: 'Science Fiction',
  },
];

describe('ReadingTimeline', () => {
  it('renders an svg element with a brush', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelector('.brush')).toBeInTheDocument();
  });

  it('updates bar widths when brushed and resets via control', () => {
    const { container, getByRole } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const brush = svg.__brush;
    const viewWidth = Number(svg.getAttribute('viewBox').split(' ')[2]);

    let rect = svg.querySelector('rect');
    const initialWidth = Number(rect.getAttribute('width'));

    let axisLabel = svg.querySelector('.x-axis .axis-label');
    expect(axisLabel).toBeInTheDocument();
    expect(axisLabel.textContent).toBe('Date');
    let tickLines = svg.querySelectorAll('.x-axis .tick line');
    expect(Number(tickLines[0].getAttribute('y2'))).toBeLessThan(0);

    act(() => {
      select(svg.querySelector('.brush')).call(brush.move, [0, viewWidth / 2]);
    });

    rect = svg.querySelector('rect');
    const zoomWidth = Number(rect.getAttribute('width'));
    expect(zoomWidth).toBeGreaterThan(initialWidth);

    axisLabel = svg.querySelector('.x-axis .axis-label');
    expect(axisLabel).toBeInTheDocument();
    tickLines = svg.querySelectorAll('.x-axis .tick line');
    expect(Number(tickLines[0].getAttribute('y2'))).toBeLessThan(0);

    const resetBtn = getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeEnabled();
    act(() => {
      fireEvent.click(resetBtn);
    });

    rect = svg.querySelector('rect');
    const resetWidth = Number(rect.getAttribute('width'));
    expect(resetWidth).toBeCloseTo(initialWidth);
    expect(resetBtn).toBeDisabled();
  });

  it('renders axis ticks and annotations', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const ticks = svg.querySelectorAll('.x-axis .tick');
    expect(ticks.length).toBeGreaterThan(0);
    // axis uses monthly ticks with abbreviated month names
    expect(ticks[0].textContent).toMatch(/^[A-Za-z]{3}$/);
    const axisLabel = svg.querySelector('.x-axis .axis-label');
    expect(axisLabel).toBeInTheDocument();
    expect(axisLabel.textContent).toBe('Date');
    const tickLines = svg.querySelectorAll('.x-axis .tick line');
    expect(tickLines.length).toBeGreaterThan(0);
    expect(Number(tickLines[0].getAttribute('y2'))).toBeLessThan(0);

    const rects = svg.querySelectorAll('rect[height="30"]');
    const longestAnnot = svg.querySelector('.annotation-longest');
    const shortestAnnot = svg.querySelector('.annotation-shortest');
    expect(longestAnnot).toBeInTheDocument();
    expect(shortestAnnot).toBeInTheDocument();
    expect(longestAnnot.textContent).toBe('Longest');
    expect(shortestAnnot.textContent).toBe('Shortest');
    // annotations should sit just above their respective bars
    expect(Number(shortestAnnot.getAttribute('y'))).toBe(
      Number(rects[0].getAttribute('y')) - 2,
    );
    expect(Number(longestAnnot.getAttribute('y'))).toBe(
      Number(rects[1].getAttribute('y')) - 2,
    );
  });

  it('places overlapping sessions in distinct vertical positions', () => {
    const { container } = render(<ReadingTimeline sessions={overlapping} />);
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[height="30"]');
    expect(rects.length).toBe(2);
    const y1 = rects[0].getAttribute('y');
    const y2 = rects[1].getAttribute('y');
    expect(y1).not.toBe(y2);
  });

  it('assigns colors based on genre', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[height="30"]');
    expect(rects[0].getAttribute('fill')).toBe('hsl(var(--chart-1))');
    expect(rects[1].getAttribute('fill')).toBe('hsl(var(--chart-2))');
  });

  it('renders a legend for genres with matching colors', () => {
    const { getByRole } = render(<ReadingTimeline sessions={sessions} />);
    const list = getByRole('list', { name: /genres/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Mystery');
    const swatch = items[0].querySelector('span[aria-hidden="true"]');
    expect(swatch).toHaveStyle({ backgroundColor: 'hsl(var(--chart-1))' });
  });
});
