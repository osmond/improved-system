import { describe, it, expect } from 'vitest';
import { aggregateDailyReading } from '../readingStats';

describe('aggregateDailyReading', () => {
  it('aggregates minutes and pages per day', () => {
    const sessions = [
      { start_timestamp: '2024-01-01T00:00:00Z', total_reading_millis: '600000', number_of_page_flips: '10' },
      { start_timestamp: '2024-01-01T01:00:00Z', total_reading_millis: '300000', number_of_page_flips: '5' },
      { start_timestamp: '2024-01-02T00:00:00Z', total_reading_millis: '120000', number_of_page_flips: '2' },
    ];
    const result = aggregateDailyReading(sessions);
    expect(result).toEqual([
      { date: '2024-01-01', minutes: 15, pages: 15 },
      { date: '2024-01-02', minutes: 2, pages: 2 },
    ]);
  });
});
