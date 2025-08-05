import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GenreSankey from '../GenreSankey';

describe('GenreSankey', () => {
  it('renders date controls and svg', async () => {
    const { container } = render(<GenreSankey />);
    expect(screen.getByLabelText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('End')).toBeInTheDocument();
    await waitFor(() => {
      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
    });
  });

  it('renders links with non-gray strokes', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      const links = container.querySelectorAll('path');
      expect(links.length).toBeGreaterThan(0);
      const hasColoredLink = Array.from(links).some((link) => {
        const stroke = link.getAttribute('stroke');
        return stroke && stroke !== '#999' && stroke !== 'var(--chart-network-link)';
      });
      expect(hasColoredLink).toBe(true);
    });
  });
});
