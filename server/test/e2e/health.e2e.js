import request from 'supertest';
import app from '../../app';

describe('Health E2E Test', () => {
  it('should return status 200 on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});
