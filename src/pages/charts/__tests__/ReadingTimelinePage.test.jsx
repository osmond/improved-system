import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ReadingTimelinePage from '../ReadingTimeline.jsx';
import useReadingSessions from '@/hooks/useReadingSessions';

vi.mock('@/hooks/useReadingSessions');
vi.mock('@/components/timeline/ReadingTimeline.jsx', () => ({
  default: () => <div data-testid="timeline" />,
}));

describe('ReadingTimelinePage', () => {
  it('shows skeleton while loading', () => {
    useReadingSessions.mockReturnValue({ data: null, error: null, isLoading: true });
    const { getByTestId } = render(<ReadingTimelinePage />);
    expect(getByTestId('timeline-skeleton')).toBeInTheDocument();
  });
});
