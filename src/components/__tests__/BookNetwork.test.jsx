import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BookNetwork component', () => {
  it('fetches graph and filters nodes by tag', async () => {
    const graph = {
      nodes: [
        { id: '1', title: 'One', tags: ['mystery'], authors: ['Alice'] },
        { id: '2', title: 'Two', tags: ['scifi'], authors: ['Bob'] },
      ],
      links: [],
    };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(graph),
    });

    const { container } = render(<BookNetwork />);
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/kindle/book-graph'));
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(2);
    });

    const tagInput = container.querySelector('input[placeholder="Filter by tag"]');
    fireEvent.change(tagInput, { target: { value: 'mystery' } });
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(1);
    });
  });
});
