import { describe, it, expect } from 'vitest';
import { calculateGenreTransitions } from '../genreTransitions';

describe('calculateGenreTransitions', () => {
  it('counts transitions between genres with monthly breakdowns and removes cycles', () => {
    const sessions = [
      { start: '2024-01-01T00:00:00Z', asin: 'A' },
      { start: '2024-01-02T00:00:00Z', asin: 'B' },
      { start: '2024-02-03T00:00:00Z', asin: 'A' },
    ];
    const genres = [
      { ASIN: 'A', Genre: 'Fantasy' },
      { ASIN: 'B', Genre: 'Sci-Fi' },
    ];
    const result = calculateGenreTransitions(sessions, genres);
    expect(result).toEqual({
      transitions: [
        {
          source: 'Sci-Fi',
          target: 'Fantasy',
          count: 1,
          monthlyCounts: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      unknownCount: 0,
      totalSessions: 3,
    });
  });
});
