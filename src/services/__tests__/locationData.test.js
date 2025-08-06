import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSessionLocations, fetchSessionLocations } from '../locationData';

describe('location data serialization', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('provides numeric latitude and longitude', () => {
    const data = getSessionLocations();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    const item = data[0];
    expect(typeof item.latitude).toBe('number');
    expect(typeof item.longitude).toBe('number');
    expect(item.title).not.toMatch(/^[A-Z0-9]{10}$/);
  });

  it('returns cached data when available', () => {
    const cached = [
      { latitude: 1, longitude: 2, start: '2024-01-01T00:00:00Z', title: 'Test' },
    ];
    localStorage.setItem(
      'cachedLocations',
      JSON.stringify({ timestamp: Date.now(), data: cached })
    );
    const data = getSessionLocations();
    expect(data).toEqual(cached);
  });

  it('uses cache instead of network when fresh', async () => {
    const cached = [
      { latitude: 3, longitude: 4, start: '2024-01-02T00:00:00Z', title: 'Cached' },
    ];
    localStorage.setItem(
      'cachedLocations',
      JSON.stringify({ timestamp: Date.now(), data: cached })
    );
    const fetchSpy = vi.spyOn(global, 'fetch');
    const data = await fetchSessionLocations();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(data).toEqual(cached);
  });

  it('caches fetched data', async () => {
    const fresh = [
      { latitude: 5, longitude: 6, start: '2024-01-03T00:00:00Z', title: 'Fresh' },
    ];
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => fresh,
    });
    const result = await fetchSessionLocations();
    expect(result).toEqual(fresh);
    const cached = JSON.parse(localStorage.getItem('cachedLocations'));
    expect(Array.isArray(cached.data)).toBe(true);
    expect(cached.data).toEqual(fresh);
  });
});
