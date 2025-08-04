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
});
