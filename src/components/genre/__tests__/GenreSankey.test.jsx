import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GenreSankey from '../GenreSankey';

describe('GenreSankey', () => {
  beforeEach(() => {
    for (let i = 1; i <= 10; i++) {
      document.documentElement.style.setProperty(
        `--chart-${i}`,
        `${(i - 1) * 36} 100% 50%`
      );
    }
  });

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

  it('uses chart token palette for nodes', async () => {
    const { container } = render(<GenreSankey />);
    const chart1 = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-1')
      .trim()
      .replace(/\s+/g, ',');
    const expected = `hsl(${chart1})`;
    await waitFor(() => {
      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
      const hasChart1 = Array.from(rects).some(
        (r) => r.getAttribute('fill') === expected
      );
      expect(hasChart1).toBe(true);
    });
  });
});
