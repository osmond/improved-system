import { promises as fs } from 'fs';

const sessionsPath = 'src/data/kindle/sessions.json';
const asinTitleMapPath = 'src/data/kindle/asin-title-map.json';
const outputPath = 'src/data/kindle/locations.json';

const cities = [
  { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
  { latitude: 40.7128, longitude: -74.006 }, // New York
  { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
  { latitude: 51.5074, longitude: -0.1278 }, // London
  { latitude: 48.8566, longitude: 2.3522 }, // Paris
  { latitude: 35.6895, longitude: 139.6917 }, // Tokyo
  { latitude: 52.52, longitude: 13.405 }, // Berlin
  { latitude: -33.8688, longitude: 151.2093 }, // Sydney
  { latitude: 55.7558, longitude: 37.6173 }, // Moscow
  { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
];

function hash(str) {
  let h = 0;
  for (const ch of str) h = (h + ch.charCodeAt(0)) % 2147483647;
  return h;
}

async function main() {
  const sessions = JSON.parse(await fs.readFile(sessionsPath, 'utf8'));
  const asinTitleMap = JSON.parse(await fs.readFile(asinTitleMapPath, 'utf8'));
  const validAsins = new Set(Object.keys(asinTitleMap));

  const asinStart = new Map();
  for (const s of sessions) {
    if (!s.asin || !s.start || !validAsins.has(s.asin)) continue;
    const t = new Date(s.start);
    if (Number.isNaN(t.getTime())) continue;
    const prev = asinStart.get(s.asin);
    if (!prev || t < prev) {
      asinStart.set(s.asin, t);
    }
  }

  const entries = [];
  const cityCount = cities.length;
  for (const [asin, date] of asinStart) {
    const city = cities[hash(asin) % cityCount];
    entries.push({
      start: date.toISOString(),
      title: asin,
      latitude: city.latitude,
      longitude: city.longitude,
    });
  }

  entries.sort((a, b) => new Date(a.start) - new Date(b.start));

  await fs.writeFile(outputPath, JSON.stringify(entries, null, 2) + '\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
