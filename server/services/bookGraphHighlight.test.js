/* @vitest-environment node */
import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

describe('getBookGraph highlight mapping', () => {
  it('attaches highlights to correct books regardless of order', async () => {
    const ordersCsv = 'ASIN,Product Name\nB,Title B\nA,Title A';
    const authorsCsv = 'ASIN,Author Name\nA,Author A\nB,Author B';
    const genresCsv = 'ASIN,Genre\nA,Genre A\nB,Genre B';
    const highlightsJson = JSON.stringify({
      A: ['A highlight'],
      B: ['B highlight']
    });
    vi.spyOn(fs, 'createReadStream').mockImplementation((p) => {
      if (p.includes('CustomerOrders')) return Readable.from([ordersCsv]);
      if (p.includes('CustomerAuthorNameRelationship')) return Readable.from([authorsCsv]);
      if (p.includes('CustomerGenres')) return Readable.from([genresCsv]);
      throw new Error(`Unexpected path: ${p}`);
    });
    vi.spyOn(fs.promises, 'readFile').mockImplementation(async (p) => {
      if (p.endsWith('highlights.json')) return highlightsJson;
      return '';
    });
    const buildBookGraph = vi.fn((books) => books);
    const modPath = require.resolve('../../src/services/bookGraph.js');
    require.cache[modPath] = { exports: { buildBookGraph } };
    const { getBookGraph } = require('./kindleService');
    const books = await getBookGraph();
    expect(buildBookGraph).toHaveBeenCalled();
    const bookA = books.find((b) => b.asin === 'A');
    const bookB = books.find((b) => b.asin === 'B');
    expect(bookA.highlights).toEqual(['A highlight']);
    expect(bookB.highlights).toEqual(['B highlight']);
  });
});
