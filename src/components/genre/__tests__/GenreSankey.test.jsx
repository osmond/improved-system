import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GenreSankey from '../GenreSankey';
import { vi } from 'vitest';

describe('GenreSankey', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = originalFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('filters data when dates are applied', async () => {
    const filtered = [{ source: 'A', target: 'B', count: 1 }];
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(filtered),
    });

    const { container } = render(<GenreSankey />);
    expect(screen.getByLabelText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('End')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    const initialCount = container.querySelectorAll('path').length;
    expect(initialCount).toBeGreaterThan(filtered.length);

    fireEvent.change(screen.getByLabelText('Start'), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText('End'), {
      target: { value: '2024-01-31' },
    });
    expect(global.fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        '/api/kindle/genre-transitions?start=2024-01-01&end=2024-01-31',
      );
      expect(container.querySelectorAll('path').length).toBe(filtered.length);
    });
    expect(container.querySelectorAll('path').length).not.toBe(initialCount);
  });

  it('renders at least one link sharing a node color', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      const links = container.querySelectorAll('path');
      const nodes = container.querySelectorAll('rect');
      expect(links.length).toBeGreaterThan(0);
      expect(nodes.length).toBeGreaterThan(0);

      const nodeColors = Array.from(nodes).map((n) => n.getAttribute('fill'));
      const hasColoredLink = Array.from(links).some((link) => {
        const stroke = link.getAttribute('stroke');
        return stroke && stroke !== '#999' && nodeColors.includes(stroke);
      });
      expect(hasColoredLink).toBe(true);
    });
  });

  it('renders highest-outflow genre leftmost', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    });
    const rects = container.querySelectorAll('rect');
    const texts = container.querySelectorAll('text');
    const nodes = Array.from(rects).map((r, i) => ({
      x: parseFloat(r.getAttribute('x') || '0'),
      name: texts[i].textContent,
    }));
    nodes.sort((a, b) => a.x - b.x);
    expect(nodes[0].name).toBe('Literature & Fiction');
  });

  it('shows a tooltip with text and bar chart on link hover', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    const link = container.querySelector('path');
    fireEvent.mouseOver(link, {
      clientX: 50,
      clientY: 50,
      pageX: 50,
      pageY: 50,
    });
    const tooltip = screen.getByTestId('tooltip');
    await waitFor(() => {
      expect(tooltip).toHaveStyle({ display: 'block' });
    });
    expect(tooltip).toHaveTextContent(
      'Mystery, Thriller & Suspense → Science & Math: 10 sessions',
    );
    const svg = tooltip.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelectorAll('rect').length).toBe(12);
    fireEvent.mouseOut(link);
    await waitFor(() => {
      expect(tooltip).toHaveStyle({ display: 'none' });
    });
  });
});
