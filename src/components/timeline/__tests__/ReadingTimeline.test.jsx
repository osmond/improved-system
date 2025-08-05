import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { select } from 'd3-selection';
import ReadingTimeline from '../ReadingTimeline.jsx';

const sessions = [
  {
    start: '2025-01-01T00:00:00Z',
    end: '2025-01-01T00:30:00Z',
    asin: 'B001',
    title: 'Test Book 1',
    duration: 30,
    highlights: 2,
  },
  {
    start: '2025-01-01T00:30:00Z',
    end: '2025-01-01T01:00:00Z',
    asin: 'B002',
    title: 'Test Book 2',
    duration: 30,
    highlights: 1,
  },
];

describe('ReadingTimeline', () => {
  it('renders an svg element with a brush', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelector('.brush')).toBeInTheDocument();
  });

  it('updates bar widths when brushed', () => {
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    const svg = container.querySelector('svg');
    const brush = svg.__brush;
    const viewWidth = Number(svg.getAttribute('viewBox').split(' ')[2]);

    let rect = svg.querySelector('rect');
    const initialWidth = Number(rect.getAttribute('width'));

    select(svg.querySelector('.brush')).call(brush.move, [0, viewWidth / 2]);

    rect = svg.querySelector('rect');
    const zoomWidth = Number(rect.getAttribute('width'));
    expect(zoomWidth).toBeGreaterThan(initialWidth);

    select(svg.querySelector('.brush')).call(brush.move, null);
    rect = svg.querySelector('rect');
    const resetWidth = Number(rect.getAttribute('width'));
    expect(resetWidth).toBeCloseTo(initialWidth);
  });
});
