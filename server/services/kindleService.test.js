/* @vitest-environment node */
import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { getEvents, getPoints, getAchievements } from './kindleService';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('kindleService', () => {
  it('getEvents parses CSV into array of records', () => {
    const csv = 'Timestamp,Activity\n2025-01-01T00:00:00Z,OPENED';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(csv);
    const result = getEvents();
    expect(result).toEqual([
      { Timestamp: '2025-01-01T00:00:00Z', Activity: 'OPENED' },
    ]);
  });

  it('getPoints returns first row as object', () => {
    const csv = 'Available Balance (Points),Marketplace,Pending Balance (Points)\n10,www.amazon.com,0';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(csv);
    const result = getPoints();
    expect(result).toEqual({
      'Available Balance (Points)': '10',
      Marketplace: 'www.amazon.com',
      'Pending Balance (Points)': '0',
    });
  });

  it('getAchievements parses CSV into array', () => {
    const csv = 'AchievementGroupName,AchievementName,EarnDate,Marketplace,Quantity\nGroup,Gold,2024-01-01Z,www.amazon.com,1';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(csv);
    const result = getAchievements();
    expect(result).toEqual([
      {
        AchievementGroupName: 'Group',
        AchievementName: 'Gold',
        EarnDate: '2024-01-01Z',
        Marketplace: 'www.amazon.com',
        Quantity: '1',
      },
    ]);
  });
});
