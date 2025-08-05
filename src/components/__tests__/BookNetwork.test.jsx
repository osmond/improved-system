import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';

vi.mock('@/data/kindle/book-graph.json', () => ({
  default: {
    nodes: [
      { id: '1', title: 'A', authors: [], tags: ['foo'] },
      { id: '2', title: 'B', authors: [], tags: ['foo'] },
      { id: '3', title: 'C', authors: [], tags: [] },
    ],
    links: [
      { source: '1', target: '2', weight: 1 },
      { source: '2', target: '3', weight: 1 },
    ],
  },
}));

describe('BookNetwork component', () => {
  it('highlights paths on tag search', async () => {
    const { container } = render(<BookNetwork />);
    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
    });

    const node = container.querySelector('[data-id="1"]');
    fireEvent.click(node);

    const tagInput = container.querySelector('input[placeholder="Filter by tag"]');
    fireEvent.change(tagInput, { target: { value: 'foo' } });

    await waitFor(() => {
      const highlighted = container.querySelectorAll(
        '[data-testid="node"][stroke="orange"]'
      );
      expect(highlighted.length).toBe(2);
      const link = container.querySelector('line[stroke="orange"]');
      expect(link).toBeTruthy();
    });
  });

  it('renders nodes with CSS variable fill', async () => {
    const { container } = render(<BookNetwork />);
    await waitFor(() => {
      const node = container.querySelector('[data-testid="node"]');
      expect(node).toBeTruthy();
      expect(node.getAttribute('fill')).toBe('var(--chart-network-node)');
    });
  });
});

