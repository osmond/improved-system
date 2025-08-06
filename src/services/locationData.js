import sessionLocations from '../data/kindle/locations.json';
import asinTitleMap from '../data/kindle/asin-title-map.json';

const CACHE_KEY = 'cachedLocations';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function mapTitles(data) {
  return data.map((l) => ({
    ...l,
    title: asinTitleMap[l.title] ?? l.title,
  }));
}

export function getSessionLocations() {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.data)) {
          return mapTitles(parsed.data);
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return mapTitles(sessionLocations);
}

export async function fetchSessionLocations() {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          Array.isArray(parsed.data) &&
          typeof parsed.timestamp === 'number' &&
          Date.now() - parsed.timestamp < CACHE_TTL
        ) {
          return mapTitles(parsed.data);
        }
      }
    } catch {
      // ignore cache errors
    }
  }

  const baseUrl =
    import.meta.env?.VITE_API_URL ??
    process.env.VITE_API_URL ??
    'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/kindle/locations`);
  if (!res.ok) throw new Error('Failed to fetch locations');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid locations data');
  const mapped = mapTitles(data);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: mapped })
      );
    } catch {
      // ignore storage errors
    }
  }
  return mapped;
}
