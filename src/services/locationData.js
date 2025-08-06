import sessionLocations from '../data/kindle/locations.json' with { type: 'json' };

export function getSessionLocations() {
  return sessionLocations;
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
  return data;
}
