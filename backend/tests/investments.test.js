const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let token;
let investmentId;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Register and login a test user
  await request(app).post('/auth/register').send({
    name: 'Test User',
    email: 'invest@test.com',
    password: 'Password123',
    remindersInterval: 7
  });
  const loginRes = await request(app).post('/auth/login').send({ email: 'invest@test.com', password: 'Password123' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Investments CRUD', () => {
  test('POST /investments creates an investment', async () => {
    const res = await request(app)
      .post('/investments')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Investment', amount: 1000, type: 'stock', date: '2023-01-01' })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    investmentId = res.body._id;
  });

  test('GET /investments returns list', async () => {
    const res = await request(app)
      .get('/investments')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(i => i._id === investmentId)).toBe(true);
  });

  test('GET /investments/:id returns the investment', async () => {
    const res = await request(app)
      .get(`/investments/${investmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id', investmentId);
  });

  test('PUT /investments/:id updates the investment', async () => {
    const res = await request(app)
      .put(`/investments/${investmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Investment', amount: 1500, type: 'stock', date: '2023-01-01' })
      .expect(200);
    expect(res.body).toHaveProperty('name', 'Updated Investment');
  });

  test('DELETE /investments/:id removes the investment', async () => {
    await request(app)
      .delete(`/investments/${investmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // Verify it no longer exists
    await request(app)
      .get(`/investments/${investmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
