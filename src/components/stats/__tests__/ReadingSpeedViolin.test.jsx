import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReadingSpeedViolin from '../ReadingSpeedViolin';
import '@testing-library/jest-dom';

describe('ReadingSpeedViolin', () => {
  it('renders controls and chart', async () => {
    render(<ReadingSpeedViolin />);
    expect(screen.getByLabelText('Morning')).toBeInTheDocument();
    expect(screen.getByLabelText('Evening')).toBeInTheDocument();
    expect(screen.getByLabelText('Bandwidth')).toBeInTheDocument();
    await waitFor(() => {
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });
  });
});
