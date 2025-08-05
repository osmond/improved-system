import { describe, it, expect } from 'vitest';
import { calculateReadingSpeeds } from '../readingSpeed';

describe('calculateReadingSpeeds', () => {
  it('computes words per minute and period for sessions', () => {
    const sessions = [
      {
        start_timestamp: '2024-01-01T08:00:00Z',
        total_reading_millis: '600000',
        number_of_page_flips: '10',
      },
      {
        start_timestamp: '2024-01-01T20:00:00Z',
        total_reading_millis: '300000',
        number_of_page_flips: '5',
      },
    ];
    const result = calculateReadingSpeeds(sessions);
    expect(result).toEqual([
      {
        start: '2024-01-01T08:00:00Z',
        asin: undefined,
        wpm: 2500 / 10, // 10 pages * 250 words / 10 minutes
        period: 'morning',
      },
      {
        start: '2024-01-01T20:00:00Z',
        asin: undefined,
        wpm: 1250 / 5, // 5 pages * 250 words / 5 minutes
        period: 'evening',
      },
    ]);
  });
});
