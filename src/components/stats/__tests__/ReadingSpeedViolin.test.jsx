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

  it('applies network node border color via CSS variable', async () => {
    const { container } = render(<ReadingSpeedViolin />);

    await waitFor(() => {
      expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    });

    const usesVar = Array.from(container.querySelectorAll('rect')).some(
      (el) => el.getAttribute('stroke') === 'var(--chart-network-node-border)'
    );

    expect(usesVar).toBe(true);
  });
});
