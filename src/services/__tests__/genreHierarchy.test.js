import { describe, it, expect } from 'vitest';
import { buildGenreHierarchy } from '../genreHierarchy';

describe('buildGenreHierarchy', () => {
  it('builds nested tree from flat records', () => {
    const sessions = [
      { asin: 'B000OZ0NXA', duration: 30 },
      { asin: 'B000FC1MBO', duration: 15 },
    ];
    const genres = [
      { ASIN: 'B000OZ0NXA', Genre: 'Fiction' },
      { ASIN: 'B000FC1MBO', Genre: 'Fiction' },
    ];
    const authors = [
      { ASIN: 'B000OZ0NXA', 'Author Name': 'Author A' },
      { ASIN: 'B000FC1MBO', 'Author Name': 'Author B' },
    ];
    const tags = [
      {
        ASIN: 'B000OZ0NXA',
        'Tag Source Group': 'genre',
        'Tag Name': 'Mystery',
      },
      {
        ASIN: 'B000FC1MBO',
        'Tag Source Group': 'genre',
        'Tag Name': 'Fantasy',
      },
    ];
    const root = buildGenreHierarchy(sessions, genres, authors, tags);
    expect(root.name).toBe('root');
    const fiction = root.children.find((c) => c.name === 'Fiction');
    expect(fiction.children).toHaveLength(2);
    const mystery = fiction.children.find((c) => c.name === 'Mystery');
    expect(mystery.children[0].name).toBe('Author A');
    const book = mystery.children[0].children[0];
    expect(book).toEqual({
      name: 'Killing Floor (Jack Reacher, Book 1)',
      value: 30,
    });
  });
});
