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

  it('renders a skeleton before data resolves', async () => {
    render(<GenreSankey />);
    expect(
      screen.getByTestId('genre-sankey-skeleton'),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByTestId('genre-sankey-skeleton'),
      ).not.toBeInTheDocument();
    });
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

  it('filters data by genre name', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    const initialCount = container.querySelectorAll('path').length;
    fireEvent.change(screen.getByLabelText('Filter'), {
      target: { value: 'Self-Help' },
    });
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBe(4);
    });
    expect(container.querySelectorAll('path').length).toBeLessThan(initialCount);
    fireEvent.click(screen.getByText('Clear Filter'));
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBe(initialCount);
    });
  });

  it('renders link gradients transitioning between node colors', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      const links = container.querySelectorAll('path');
      const nodes = container.querySelectorAll('rect');
      const gradients = container.querySelectorAll('linearGradient');
      expect(links.length).toBeGreaterThan(0);
      expect(nodes.length).toBeGreaterThan(0);
      expect(gradients.length).toBeGreaterThan(0);

      const stroke = links[0].getAttribute('stroke') || '';
      const match = stroke.match(/url\(#(.*)\)/);
      expect(match).not.toBeNull();
      const gradient = container.querySelector(`#${match[1]}`);
      expect(gradient).toBeInTheDocument();
      const stopColors = Array.from(gradient.querySelectorAll('stop')).map((s) =>
        s.getAttribute('stop-color'),
      );
      const nodeColors = Array.from(nodes).map((n) => n.getAttribute('fill'));
      stopColors.forEach((c) => expect(nodeColors).toContain(c));
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
    expect(nodes[0].name).toBe('Self-Help');
  });

  it('shows a tooltip with text and bar chart on link hover', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    const link = container.querySelector('path');
    const label = link.getAttribute('aria-label') || '';
    const [, from, to, count] = label.match(
      /^From (.*) to (.*): (\d+) sessions$/,
    );
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
      `${from} → ${to}: ${count} sessions`,
    );
    expect(tooltip).toHaveTextContent('% of');
    const svg = tooltip.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelectorAll('rect').length).toBe(12);
    fireEvent.mouseOut(link);
    await waitFor(() => {
      expect(tooltip).toHaveStyle({ display: 'none' });
    });
  });

  it('shows a tooltip on link focus', async () => {
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    const link = container.querySelector('path');
    // jsdom provides a rect of zeros; ensure presence of method
    link.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 10,
      height: 10,
      right: 10,
      bottom: 10,
    });
    fireEvent.focus(link);
    const tooltip = screen.getByTestId('tooltip');
    await waitFor(() => {
      expect(tooltip).toHaveStyle({ display: 'block' });
    });
    fireEvent.blur(link);
    await waitFor(() => {
      expect(tooltip).toHaveStyle({ display: 'none' });
    });
  });
});
