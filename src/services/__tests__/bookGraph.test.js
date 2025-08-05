import { describe, it, expect } from 'vitest';
import { buildBookGraph } from '../bookGraph';

describe('bookGraph', () => {
  it('builds similarity graph from tags, authors and highlights', () => {
    const books = [
      {
        asin: 'A1',
        title: 'Book 1',
        tags: ['fiction'],
        authors: ['Alice'],
        highlights: ['foo bar baz'],
      },
      {
        asin: 'A2',
        title: 'Book 2',
        tags: ['fiction'],
        authors: ['Bob'],
        highlights: ['foo qux'],
      },
      {
        asin: 'A3',
        title: 'Book 3',
        tags: ['history'],
        authors: ['Alice'],
        highlights: ['different words'],
      },
    ];
    const graph = buildBookGraph(books);
    expect(graph.nodes).toHaveLength(3);
    expect(graph.links).toHaveLength(2);
    const edge = graph.links.find(
      (e) =>
        (e.source === 'A1' && e.target === 'A2') ||
        (e.source === 'A2' && e.target === 'A1')
    );
    expect(edge.weight).toBeCloseTo(1.25, 2);
  });
});
