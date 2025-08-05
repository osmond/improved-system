import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
  },
  {
    start: '2025-01-01T00:30:00Z',
    end: '2025-01-01T01:00:00Z',
    asin: 'B002',
    title: 'Test Book 2',
    duration: 40,
    highlights: 1,
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
  },
  {
    start: '2025-01-01T00:15:00Z',
    end: '2025-01-01T00:45:00Z',
    asin: 'B002',
    title: 'Overlap 2',
    duration: 25,
    highlights: 3,
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

    act(() => {
      select(svg.querySelector('.brush')).call(brush.move, [0, viewWidth / 2]);
    });

    rect = svg.querySelector('rect');
    const zoomWidth = Number(rect.getAttribute('width'));
    expect(zoomWidth).toBeGreaterThan(initialWidth);

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
    expect(svg.querySelector('.annotation-longest')).toBeInTheDocument();
    expect(svg.querySelector('.annotation-shortest')).toBeInTheDocument();
  });

  it('places overlapping sessions in distinct vertical positions', () => {
    const { container } = render(<ReadingTimeline sessions={overlapping} />);
    const svg = container.querySelector('svg');
    const rects = svg.querySelectorAll('rect[fill="steelblue"]');
    expect(rects.length).toBe(2);
    const y1 = rects[0].getAttribute('y');
    const y2 = rects[1].getAttribute('y');
    expect(y1).not.toBe(y2);
  });
});
