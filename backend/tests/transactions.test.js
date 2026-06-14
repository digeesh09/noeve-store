const request = require('supertest');
const app = require('../src/index');

describe('Transactions Routes', () => {
  test('GET /transactions returns placeholder message', async () => {
    const res = await request(app)
      .get('/transactions')
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Transactions endpoint (placeholder)');
  });
});
