import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GenreSankey from '../GenreSankey';
import { vi } from 'vitest';
import transitions from '@/data/kindle/genre-transitions.json';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('GenreSankey', () => {
  it('renders a skeleton before data resolves', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(transitions),
    });
    render(<GenreSankey />);
    expect(screen.getByTestId('genre-sankey-skeleton')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('genre-sankey-skeleton')).not.toBeInTheDocument(),
    );
  });

  it('filters data when dates are applied', async () => {
    const filtered = [{ source: 'A', target: 'B', count: 1, monthlyCounts: Array(12).fill(0) }];
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(transitions),
      })
      .mockResolvedValueOnce({
        ok: true,
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

    fireEvent.change(screen.getByLabelText('Start'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText('End'), { target: { value: '2024-01-31' } });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        '/api/kindle/genre-transitions?start=2024-01-01&end=2024-01-31',
      );
      expect(container.querySelectorAll('path').length).toBe(filtered.length);
    });
    expect(container.querySelectorAll('path').length).not.toBe(initialCount);
  });

  it('disables Apply button while loading', async () => {
    const filtered = [{ source: 'A', target: 'B', count: 1 }];
    let resolveFetch;
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(transitions),
      })
      .mockImplementationOnce(
        () =>
          new Promise((res) => {
            resolveFetch = res;
          }),
      );

    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    fireEvent.change(screen.getByLabelText('Start'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText('End'), { target: { value: '2024-01-31' } });
    const apply = screen.getByText('Apply');
    fireEvent.click(apply);
    await waitFor(() => {
      expect(apply).toBeDisabled();
    });
    resolveFetch({
      ok: true,
      json: () => Promise.resolve(filtered),
    });
    await waitFor(() => {
      expect(apply).not.toBeDisabled();
    });
  });

  it('falls back to local data if fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const { container } = render(<GenreSankey />);
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('filters data by genre name', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(transitions),
    });
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
    fireEvent.click(screen.getByText('Reset Zoom'));
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBe(4);
    });
    fireEvent.click(screen.getByText('Clear Filter'));
    await waitFor(() => {
      expect(container.querySelectorAll('path').length).toBe(initialCount);
    });
  });

  it('renders link gradients transitioning between node colors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(transitions),
    });
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
});
