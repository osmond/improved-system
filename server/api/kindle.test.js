/* @vitest-environment node */
import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

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
  });

  it('returns genre transitions data', async () => {
    const res = await request(app).get('/api/kindle/genre-transitions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('source');
      expect(res.body[0]).toHaveProperty('target');
      expect(res.body[0]).toHaveProperty('count');
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
  });

  it('returns book graph data', async () => {
    const res = await request(app).get('/api/kindle/book-graph');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nodes');
    expect(res.body).toHaveProperty('links');
  });
});
