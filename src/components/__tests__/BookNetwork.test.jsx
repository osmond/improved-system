import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';
import graphData from '@/data/kindle/book-graph.json';

describe('BookNetwork component', () => {
  it('filters nodes by tag', async () => {
    const { container } = render(<BookNetwork />);
    const totalNodes = graphData.nodes.length;
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(totalNodes);
    });

    const tag = graphData.nodes.find((n) => n.tags.length > 0).tags[0];
    const expected = graphData.nodes.filter((n) => n.tags.includes(tag)).length;
    const tagInput = container.querySelector('input[placeholder="Filter by tag"]');
    fireEvent.change(tagInput, { target: { value: tag } });
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(expected);
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
