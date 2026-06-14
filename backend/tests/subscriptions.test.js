const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let token;
let subId;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Register and login a test user
  await request(app).post('/auth/register').send({
    name: 'Sub User',
    email: 'sub@test.com',
    password: 'Password123',
    remindersInterval: 7
  });
  const loginRes = await request(app).post('/auth/login').send({ email: 'sub@test.com', password: 'Password123' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Subscriptions CRUD', () => {
  test('POST /subscriptions creates a subscription', async () => {
    const res = await request(app)
      .post('/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({ service: 'Netflix', amount: 15, billingCycle: 'monthly' })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    subId = res.body._id;
  });

  test('GET /subscriptions returns list', async () => {
    const res = await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(s => s._id === subId)).toBe(true);
  });

  test('GET /subscriptions/:id returns the subscription', async () => {
    const res = await request(app)
      .get(`/subscriptions/${subId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id', subId);
  });

  test('PUT /subscriptions/:id updates the subscription', async () => {
    const res = await request(app)
      .put(`/subscriptions/${subId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 20 })
      .expect(200);
    expect(res.body).toHaveProperty('amount', 20);
  });

  test('DELETE /subscriptions/:id removes the subscription', async () => {
    await request(app)
      .delete(`/subscriptions/${subId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get(`/subscriptions/${subId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
