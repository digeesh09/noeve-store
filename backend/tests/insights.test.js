const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let token;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Register and login a test user for auth (insights route may not require auth now)
  await request(app).post('/auth/register').send({
    name: 'Insight User',
    email: 'insight@test.com',
    password: 'Password123',
    remindersInterval: 7
  });
  const loginRes = await request(app).post('/auth/login').send({ email: 'insight@test.com', password: 'Password123' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Insights placeholder', () => {
  test('GET /insights returns placeholder message', async () => {
    const res = await request(app)
      .get('/insights')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Insights endpoint (placeholder)');
  });
});
