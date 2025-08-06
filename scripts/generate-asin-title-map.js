import { promises as fs } from 'fs';
import path from 'path';

const sessionsPath = 'src/data/kindle/sessions.json';
const metadataDir = 'data/kindle/Kindle/Digital.Content.Ownership';
const outputPath = 'src/data/kindle/asin-title-map.json';

async function main() {
  const sessions = JSON.parse(await fs.readFile(sessionsPath, 'utf8'));
  const asins = [...new Set(sessions.map(s => s.asin).filter(Boolean))];

  const files = await fs.readdir(metadataDir);
  const map = {};
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(metadataDir, file), 'utf8');
    try {
      const data = JSON.parse(raw);
      const asin = data.resource?.ASIN;
      const title = data.resource?.['Product Name'];
      if (asin && title) {
        map[asin] = title;
      }
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
    }
  }

  const result = {};
  for (const asin of asins) {
    if (map[asin]) {
      result[asin] = map[asin];
    }
  }

  const sorted = Object.keys(result).sort().reduce((acc, key) => {
    acc[key] = result[key];
    return acc;
  }, {});

  await fs.writeFile(outputPath, JSON.stringify(sorted, null, 2) + '\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
