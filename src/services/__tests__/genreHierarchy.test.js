import { describe, it, expect } from 'vitest';
import { buildGenreHierarchy } from '../genreHierarchy';
const { UNCLASSIFIED_GENRE } = require('../../config/constants');

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

  it('uses asin-subgenre mapping when tags are missing', () => {
    const sessions = [{ asin: 'B01A4AXM3W', title: 'The Last Days of Night: A Novel', duration: 10 }];
    const genres = [{ ASIN: 'B01A4AXM3W', Genre: 'Fiction' }];
    const authors = [{ ASIN: 'B01A4AXM3W', 'Author Name': 'Graham Moore' }];
    const root = buildGenreHierarchy(sessions, genres, authors, []);
    const fiction = root.children.find((c) => c.name === 'Fiction');
    const sub = fiction.children.find((c) => c.name === 'Historical Thriller');
    expect(sub).toBeTruthy();
  });

  it('labels missing data as unclassified', () => {
    const sessions = [{ asin: 'X1', title: 'Untitled Book', duration: 5 }];
    const root = buildGenreHierarchy(sessions, [], [], []);
    const unc = root.children.find((c) => c.name === UNCLASSIFIED_GENRE);
    expect(unc).toBeTruthy();
    const sub = unc.children.find((c) => c.name === UNCLASSIFIED_GENRE);
    expect(sub).toBeTruthy();
    const author = sub.children.find((c) => c.name === UNCLASSIFIED_GENRE);
    expect(author.children[0]).toEqual({ name: 'Untitled Book', value: 5 });
  });
});
