import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReadingTimeline from '../ReadingTimeline.jsx';

describe('ReadingTimeline', () => {
  it('renders an svg element', () => {
    const sessions = [
      {
        start: '2025-01-01T00:00:00Z',
        end: '2025-01-01T00:30:00Z',
        asin: 'B001',
        title: 'Test Book',
        duration: 30,
        highlights: 2,
      },
    ];
    const { container } = render(<ReadingTimeline sessions={sessions} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
