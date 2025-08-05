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
    expect(
      screen.getByTestId('genre-sankey-skeleton')
    ).toBeInTheDocument();

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
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        '/api/kindle/genre-transitions?start=2024-01-01&end=2024-01-31',
      );
      expect(container.querySelectorAll('path').length).toBe(filtered.length);
    });
    expect(container.querySelectorAll('path').length).not.toBe(initialCount);
  });

  it('renders links with non-gray strokes', async () => {
    const { container } = render(<GenreSankey />);
    expect(
      screen.getByTestId('genre-sankey-skeleton')
    ).toBeInTheDocument();
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
