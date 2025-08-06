import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';

function createMockGraph() {
  return {
    nodes: [
      { id: 'a', title: 'A', authors: [], tags: [], community: 0 },
      { id: 'b', title: 'B', authors: [], tags: [], community: 0 },
      { id: 'c', title: 'C', authors: [], tags: [], community: 0 }
    ],
    links: [
      { source: 'a', target: 'b', weight: 1 },
      { source: 'b', target: 'c', weight: 1 }
    ]
  };
}

describe('BookNetwork component', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
  });

  it('shows sub-genre input and saves override', async () => {
    const { container } = render(<BookNetwork data={createMockGraph()} />);
    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
    });
    fireEvent.click(container.querySelector('[data-id="a"]'));
    await waitFor(() => {
      expect(container.querySelector('input[placeholder="Sub-genre"]')).not.toBeNull();
    });
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ a: 'Mystery' }) });
    fireEvent.change(container.querySelector('input[placeholder="Sub-genre"]'), {
      target: { value: 'Mystery' }
    });
    fireEvent.click(container.querySelector('button'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/kindle/subgenre-overrides',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
