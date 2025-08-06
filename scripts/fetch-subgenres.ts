import fs from 'fs';
import path from 'path';

// Basic script to fetch sub-genre information from Open Library
// Usage: ts-node scripts/fetch-subgenres.ts <ASIN|Title> [...]
// The script looks up titles in the existing asin-title map and queries
// the Open Library API for subject data. The first returned subject is
// stored as the sub-genre in a mapping file under src/data/kindle.

const asinTitleMap: Record<string, string> = require('../src/data/kindle/asin-title-map.json');

const subgenrePath = path.join(__dirname, '../src/data/kindle/asin-subgenre-map.json');
let existing: Record<string, string> = {};
try {
  existing = require(subgenrePath);
} catch {
  existing = {};
}

async function lookupSubjects(title: string): Promise<string[]> {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const doc = data.docs && data.docs[0];
  return (doc && doc.subject) || [];
}

async function processQuery(query: string) {
  const title = asinTitleMap[query] || query;
  const subjects = await lookupSubjects(title);
  if (subjects.length > 0) {
    existing[query] = subjects[0];
    console.log(`Found sub-genre for ${query}: ${subjects[0]}`);
  } else {
    console.log(`No sub-genre found for ${query}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: ts-node scripts/fetch-subgenres.ts <ASIN|Title> [...]');
    return;
  }
  for (const a of args) {
    await processQuery(a);
  }
  fs.writeFileSync(subgenrePath, JSON.stringify(existing, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
