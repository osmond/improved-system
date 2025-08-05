import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
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

  it('colors nodes by community', async () => {
    const color = scaleOrdinal(schemeTableau10);
    const { container } = render(<BookNetwork />);
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(graphData.nodes.length);
    });

    const domNodes = Array.from(
      container.querySelectorAll('[data-testid="node"]')
    );
    domNodes.forEach((node) => {
      const community = node.getAttribute('data-community');
      expect(node.getAttribute('fill')).toBe(color(community));
    });

    const uniqueColors = new Set(domNodes.map((n) => n.getAttribute('fill')));
    expect(uniqueColors.size).toBeGreaterThan(1);
  });
});
