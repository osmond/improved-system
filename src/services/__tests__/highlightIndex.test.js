import { describe, it, expect } from 'vitest';
import { buildHighlightIndex, getExpansions } from '../highlightIndex';

describe('highlight index', () => {
  const texts = [
    'the quick brown fox jumps over the lazy dog',
    'the quick blue hare jumps high',
    'the slow turtle crawls under the log',
  ];
  const trie = buildHighlightIndex(texts);

  it('expands single keyword', () => {
    const result = getExpansions(trie, 'the');
    expect(result[0]).toEqual({ word: 'quick', count: 2 });
    expect(result).toEqual(
      expect.arrayContaining([
        { word: 'lazy', count: 1 },
        { word: 'slow', count: 1 },
        { word: 'log', count: 1 },
      ])
    );
  });

  it('expands multi-word phrase', () => {
    const result = getExpansions(trie, 'the quick');
    expect(result).toEqual([
      { word: 'brown', count: 1 },
      { word: 'blue', count: 1 },
    ]);
  });
});
