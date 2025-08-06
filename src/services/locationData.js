import sessionLocations from '../data/kindle/locations.json';
import asinTitleMap from '../data/kindle/asin-title-map.json';

export function getSessionLocations() {
  return sessionLocations.map((l) => ({
    ...l,
    title: asinTitleMap[l.title] ?? l.title,
  }));
}

export async function fetchSessionLocations() {
  const baseUrl =
    import.meta.env?.VITE_API_URL ??
    process.env.VITE_API_URL ??
    'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/kindle/locations`);
  if (!res.ok) throw new Error('Failed to fetch locations');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid locations data');
  return data.map((l) => ({
    ...l,
    title: asinTitleMap[l.title] ?? l.title,
  }));
}
