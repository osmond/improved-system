import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReadingSpeedViolin from '../ReadingSpeedViolin';
import '@testing-library/jest-dom';

describe('ReadingSpeedViolin', () => {
  it('renders skeleton then chart', async () => {
    render(<ReadingSpeedViolin />);
    expect(screen.getByLabelText('Morning')).toBeInTheDocument();
    expect(screen.getByLabelText('Evening')).toBeInTheDocument();
    expect(screen.getByLabelText('Bandwidth')).toBeInTheDocument();
    expect(
      screen.getByTestId('reading-speed-skeleton')
    ).toBeInTheDocument();
    await waitFor(() => {
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });
  });
});
