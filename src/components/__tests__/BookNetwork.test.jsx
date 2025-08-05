import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';

function createMockGraph() {
  return {
    nodes: [
      { id: 'a', title: 'A', authors: ['Author1'], tags: [], community: 0 },
      { id: 'b', title: 'B', authors: [], tags: [], community: 0 },
      { id: 'c', title: 'C', authors: [], tags: ['tag1'], community: 0 }
    ],
    links: [
      { source: 'a', target: 'b', weight: 1 },
      { source: 'b', target: 'c', weight: 1 }
    ]
  };
}

describe('BookNetwork component', () => {
  it('highlights shortest path when searching by tag', async () => {
    const { container } = render(<BookNetwork data={createMockGraph()} />);
    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
    });

    const start = container.querySelector('[data-id="a"]');
    fireEvent.click(start);
    const tagInput = container.querySelector('input[placeholder="Filter by tag"]');
    fireEvent.change(tagInput, { target: { value: 'tag1' } });

    await waitFor(() => {
      const highlightedNodes = container.querySelectorAll('[data-testid="node"][data-highlighted="true"]');
      expect(highlightedNodes.length).toBe(3);
      const highlightedLinks = container.querySelectorAll('line[data-highlighted="true"]');
      expect(highlightedLinks.length).toBe(2);
    });
  });

  it('renders higher-degree nodes with larger radii', async () => {
    const { container } = render(<BookNetwork data={createMockGraph()} />);
    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
    });
    const radiusA = parseFloat(
      container.querySelector('[data-id="a"]').getAttribute('r')
    );
    const radiusB = parseFloat(
      container.querySelector('[data-id="b"]').getAttribute('r')
    );
    const radiusC = parseFloat(
      container.querySelector('[data-id="c"]').getAttribute('r')
    );
    expect(radiusB).toBeGreaterThan(radiusA);
    expect(radiusA).toBeCloseTo(radiusC);
  });

  it('uses chart CSS variables for node and link styles', async () => {
    const { container } = render(<BookNetwork data={createMockGraph()} />);

    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
      expect(container.querySelectorAll('line').length).toBe(2);
    });

    const nodeUsesVar = Array.from(
      container.querySelectorAll('[data-testid="node"]')
    ).some((el) => el.getAttribute('stroke') === 'var(--chart-network-node-border)');

    const linkUsesVar = Array.from(container.querySelectorAll('line')).some(
      (el) => el.getAttribute('stroke') === 'var(--chart-network-link)'
    );

    expect(nodeUsesVar).toBe(true);
    expect(linkUsesVar).toBe(true);
  });
});
