const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('should return status ok and dbStats', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    // dbStats may be empty if DB not connected; just ensure it exists
    expect(res.body).toHaveProperty('dbStats');
  });
});
