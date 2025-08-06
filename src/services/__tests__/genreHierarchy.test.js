import { describe, it, expect } from 'vitest';
import { buildGenreHierarchy, filterUnclassified } from '../genreHierarchy';
import { UNCLASSIFIED_GENRE } from '@/config/constants';

describe('buildGenreHierarchy', () => {
  it('builds nested tree from flat records', () => {
    const sessions = [
      { asin: 'A1', title: 'Book One', duration: 30 },
      { asin: 'A2', title: 'Book Two', duration: 15 },
    ];
    const genres = [
      { ASIN: 'A1', Genre: 'Fiction' },
      { ASIN: 'A2', Genre: 'Fiction' },
    ];
    const authors = [
      { ASIN: 'A1', 'Author Name': 'Author A' },
      { ASIN: 'A2', 'Author Name': 'Author B' },
    ];
    const tags = [
      { ASIN: 'A1', 'Tag Source Group': 'genre', 'Tag Name': 'Mystery' },
      { ASIN: 'A2', 'Tag Source Group': 'genre', 'Tag Name': 'Fantasy' },
    ];
    const root = buildGenreHierarchy(sessions, genres, authors, tags);
    expect(root.name).toBe('root');
    const fiction = root.children.find((c) => c.name === 'Fiction');
    expect(fiction.children).toHaveLength(2);
    const mystery = fiction.children.find((c) => c.name === 'Mystery');
    expect(mystery.children[0].name).toBe('Author A');
    const book = mystery.children[0].children[0];
    expect(book).toEqual({ name: 'Book One', value: 30 });
  });

  it('labels missing metadata with UNCLASSIFIED_GENRE and filters it', () => {
    const sessions = [
      { asin: 'A1', title: 'Book One', duration: 30 },
      { asin: 'A2', title: 'Book Two', duration: 15 },
    ];
    const genres = [{ ASIN: 'A1', Genre: 'Fiction' }];
    const authors = [{ ASIN: 'A1', 'Author Name': 'Author A' }];
    const tags = [
      { ASIN: 'A1', 'Tag Source Group': 'genre', 'Tag Name': 'Mystery' },
    ];
    const root = buildGenreHierarchy(sessions, genres, authors, tags);
    const unclassified = root.children.find(
      (c) => c.name === UNCLASSIFIED_GENRE,
    );
    expect(unclassified).toBeTruthy();

    const filtered = filterUnclassified(root);
    expect(filtered.children).toHaveLength(1);
    expect(filtered.children[0].name).toBe(UNCLASSIFIED_GENRE);
    const leaf =
      filtered.children[0].children[0].children[0].children[0];
    expect(leaf).toEqual({ name: 'Book Two', value: 15 });
  });
});
