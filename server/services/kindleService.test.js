/* @vitest-environment node */
import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { getEvents, getPoints, getAchievements } from './kindleService';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('kindleService', () => {
  it('getEvents parses CSV with quoted commas', async () => {
    const csv = 'Timestamp,Activity\n2025-01-01T00:00:00Z,"OPENED, page 1"';
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(csv);
    const result = await getEvents();
    expect(result).toEqual([
      { Timestamp: '2025-01-01T00:00:00Z', Activity: 'OPENED, page 1' },
    ]);
  });

  it('getPoints returns first row as object', async () => {
    const csv = 'Available Balance (Points),Marketplace,Pending Balance (Points)\n10,"www.amazon.com,uk",0';
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(csv);
    const result = await getPoints();
    expect(result).toEqual({
      'Available Balance (Points)': '10',
      Marketplace: 'www.amazon.com,uk',
      'Pending Balance (Points)': '0',
    });
  });

  it('getAchievements parses CSV with quoted fields', async () => {
    const csv = 'AchievementGroupName,AchievementName,EarnDate,Marketplace,Quantity\nGroup,"Gold, Level",2024-01-01Z,"www.amazon.com","1"';
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(csv);
    const result = await getAchievements();
    expect(result).toEqual([
      {
        AchievementGroupName: 'Group',
        AchievementName: 'Gold, Level',
        EarnDate: '2024-01-01Z',
        Marketplace: 'www.amazon.com',
        Quantity: '1',
      },
    ]);
  });
});
