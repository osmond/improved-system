import sessionLocations from '../data/kindle/locations.json' with { type: 'json' };

export function getSessionLocations() {
  return sessionLocations;
}

export async function fetchSessionLocations() {
  const res = await fetch('/api/kindle/locations');
  if (!res.ok) throw new Error('Failed to fetch locations');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid locations data');
  return data;
}
