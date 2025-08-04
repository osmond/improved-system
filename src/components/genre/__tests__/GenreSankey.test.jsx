import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import GenreSankey from '../GenreSankey';

describe('GenreSankey', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () =>
        Promise.resolve([
          { source: 'A', target: 'B', count: 2 },
          { source: 'B', target: 'C', count: 1 },
        ]),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders date controls and svg', async () => {
    const { container } = render(<GenreSankey />);
    expect(screen.getByLabelText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('End')).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => {
      const rects = container.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
    });
  });
});
