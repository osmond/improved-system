import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReadingSpeedViolin from '../ReadingSpeedViolin';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

const sample = [
  { start: '2024-01-01T08:00:00Z', wpm: 200, period: 'morning' },
  { start: '2024-01-01T20:00:00Z', wpm: 300, period: 'evening' },
];

vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve(sample) })));

describe('ReadingSpeedViolin', () => {
  it('renders toggles and chart', async () => {
    render(<ReadingSpeedViolin />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    expect(screen.getByLabelText('Morning')).toBeInTheDocument();
    expect(screen.getByLabelText('Evening')).toBeInTheDocument();
    await waitFor(() => {
      const rects = document.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
    });
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
});
