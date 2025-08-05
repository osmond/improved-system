import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import TimelinePage from '../TimelinePage.jsx';
import useReadingSessions from '@/hooks/useReadingSessions';

vi.mock('@/hooks/useReadingSessions');

describe('TimelinePage', () => {
  it('renders skeleton while loading', () => {
    useReadingSessions.mockReturnValue({ data: null, error: null, isLoading: true });
    const { getByTestId } = render(<TimelinePage />);
    expect(getByTestId('timeline-skeleton')).toBeInTheDocument();
  });

  it('renders timeline when data is loaded', () => {
    useReadingSessions.mockReturnValue({
      data: [
        {
          start: '2025-01-01T00:00:00Z',
          end: '2025-01-01T00:30:00Z',
          asin: 'A',
          title: 'Book',
          duration: 30,
          highlights: 0,
        },
      ],
      error: null,
      isLoading: false,
    });
    const { container } = render(<TimelinePage />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
