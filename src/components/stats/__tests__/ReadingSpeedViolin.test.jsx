import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReadingSpeedViolin from '../ReadingSpeedViolin';
import '@testing-library/jest-dom';

describe('ReadingSpeedViolin', () => {
  it('renders toggles and chart', async () => {
    render(<ReadingSpeedViolin />);
    expect(screen.getByLabelText('Morning')).toBeInTheDocument();
    expect(screen.getByLabelText('Evening')).toBeInTheDocument();
    await waitFor(() => {
      const rects = document.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
    });
  });
});
