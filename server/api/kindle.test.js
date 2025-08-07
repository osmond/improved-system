/* @vitest-environment node */
import request from 'supertest';
import app from '../app';
import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';

describe('GET /api/kindle', () => {
  it('returns events data', async () => {
    const res = await request(app).get('/api/kindle/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('Timestamp');
    expect(res.body[0]).toHaveProperty('Activity');
  });

  it('returns points data', async () => {
    const res = await request(app).get('/api/kindle/points');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('Available Balance (Points)');
    expect(res.body).toHaveProperty('Marketplace');
  });

  it('returns achievements data', async () => {
    const res = await request(app).get('/api/kindle/achievements');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('AchievementName');
  });

  it('returns daily stats data', async () => {
    const res = await request(app).get('/api/kindle/daily-stats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('date');
    expect(res.body[0]).toHaveProperty('minutes');
  });

  it('returns sessions data', async () => {
    const res = await request(app).get('/api/kindle/sessions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('start');
    expect(res.body[0]).toHaveProperty('title');
  });

  it('returns genre hierarchy data', async () => {
    const res = await request(app).get('/api/kindle/genre-hierarchy');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'root');
    expect(res.body).toHaveProperty('children');
    function leaves(node) {
      if (!node.children) return [node];
      return node.children.flatMap(leaves);
    }
    const leafNames = leaves(res.body).map((n) => n.name);
    expect(leafNames.some((n) => /\s/.test(n))).toBe(true);
  });

  it('returns genre transitions data', async () => {
    const res = await request(app).get('/api/kindle/genre-transitions');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transitions');
    expect(res.body).toHaveProperty('unknownCount');
    expect(res.body).toHaveProperty('totalSessions');
    expect(Array.isArray(res.body.transitions)).toBe(true);
    if (res.body.transitions.length > 0) {
      const first = res.body.transitions[0];
      expect(first).toHaveProperty('source');
      expect(first).toHaveProperty('target');
      expect(first).toHaveProperty('count');
      expect(first).toHaveProperty('monthlyCounts');
    }
  });

  it('returns highlight expansions', async () => {
    const res = await request(app).get('/api/kindle/highlights/search?keyword=the');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('word', 'quick');
    expect(res.body[0]).toHaveProperty('count', 2);
  });

  it('returns location data', async () => {
    const res = await request(app).get('/api/kindle/locations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('latitude');
    expect(res.body[0]).toHaveProperty('longitude');
    expect(res.body[0].title).not.toMatch(/^[A-Z0-9]{10}$/);
  });

  it('returns book graph data', async () => {
    const res = await request(app).get('/api/kindle/book-graph');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nodes');
    expect(res.body).toHaveProperty('links');
  });

  it('gets and updates subgenre overrides', async () => {
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('{}');
    const writeMock = vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    const getRes = await request(app).get('/api/kindle/subgenre-overrides');
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual({});
    const postRes = await request(app)
      .post('/api/kindle/subgenre-overrides')
      .send({ asin: 'TEST', subgenre: 'SG' });
    expect(postRes.status).toBe(200);
    expect(writeMock).toHaveBeenCalled();
    expect(postRes.body).toHaveProperty('TEST', 'SG');
    vi.restoreAllMocks();
  });
});
