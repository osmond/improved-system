import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { select } from 'd3-selection';
import { act } from 'react';
import ReadingTimeline from '../ReadingTimeline.jsx';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

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
    const { container, queryByRole, getByRole } = render(<ReadingTimeline sessions={sessions} />);
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

    // Reset button should be hidden initially
    expect(queryByRole('button', { name: /reset/i })).toBeNull();

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
    expect(queryByRole('button', { name: /reset/i })).toBeNull();
  });

  it('renders axis ticks and annotations', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const ticks = svg.querySelectorAll('.x-axis .tick');
    expect(ticks.length).toBeGreaterThan(0);
    // axis uses quarterly ticks with month labels and occasional year
    expect(ticks[0].textContent).toMatch(/[A-Za-z]{3}/);
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

  it('assigns colors based on title', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[height="30"]');
    expect(rects[0].getAttribute('fill')).toBe('hsl(var(--chart-1))');
    expect(rects[1].getAttribute('fill')).toBe('hsl(var(--chart-2))');
  });

  it('encodes duration using opacity', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[height="30"]');
    const op1 = Number(rects[0].getAttribute('fill-opacity'));
    const op2 = Number(rects[1].getAttribute('fill-opacity'));
    expect(op2).toBeGreaterThan(op1);
  });

  it('makes each bar focusable with an aria-label', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[tabindex="0"]');
    expect(rects).toHaveLength(sessions.length);
    expect(rects[0].getAttribute('aria-label')).toContain('Test Book 1');
  });

  it('renders a legend for books with matching colors', () => {
    const { getByRole } = render(<ReadingTimeline sessions={sessions} />);
    fireEvent.click(getByRole('button', { name: /show books/i }));
    const list = getByRole('list', { name: /books/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Test Book 1');
    const swatch = items[0].querySelector('span[aria-hidden="true"]');
    expect(swatch).toHaveStyle({ backgroundColor: 'hsl(var(--chart-1))' });
  });

  it('supports keyboard interaction with the brush', () => {
    const { container, getByRole } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const brushG = svg.querySelector('.brush');
    expect(brushG.getAttribute('tabindex')).toBe('0');

    // move selection with keyboard and apply with Enter
    fireEvent.keyDown(brushG, { key: 'ArrowRight' });
    fireEvent.keyDown(brushG, { key: 'Enter' });

    const resetBtn = getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeEnabled();
  });

  it('displays titles in bar tooltips and legend labels', () => {
    const { container, getByRole } = render(
      <ReadingTimeline sessions={sessions} />,
    );
    fireEvent.click(getByRole('button', { name: /show books/i }));
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[height="30"]');
    expect(rects[0].querySelector('title')?.textContent).toContain('Test Book 1');
    const list = getByRole('list', { name: /books/i });
    expect(within(list).getByText('Test Book 1')).toBeInTheDocument();
  });

  it('filters sessions based on search', async () => {
    const { getByPlaceholderText, container, getByRole } = render(
      <ReadingTimeline sessions={sessions} />,
    );
    fireEvent.click(getByRole('button', { name: /show books/i }));
    const input = getByPlaceholderText(/search/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Book 1' } });
    });
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[height="30"]');
    expect(rects).toHaveLength(1);
  });
});
