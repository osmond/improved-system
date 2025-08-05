const sessionLocations = require('../data/kindle/locations.json');

function getSessionLocations() {
  return sessionLocations;
}

async function fetchSessionLocations() {
  const res = await fetch('/api/kindle/locations');
  if (!res.ok) throw new Error('Failed to fetch locations');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid locations data');
  return data;
}

module.exports = { getSessionLocations, fetchSessionLocations };
