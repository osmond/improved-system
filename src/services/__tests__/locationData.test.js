import { describe, it, expect } from 'vitest';
const { getSessionLocations } = require('../locationData');

describe('location data serialization', () => {
  it('provides numeric latitude and longitude', () => {
    const data = getSessionLocations();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    const item = data[0];
    expect(typeof item.latitude).toBe('number');
    expect(typeof item.longitude).toBe('number');
  });
});
