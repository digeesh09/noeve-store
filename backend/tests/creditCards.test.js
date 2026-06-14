const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let token;
let cardId;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Register and login a test user
  await request(app).post('/auth/register').send({
    name: 'Card User',
    email: 'card@test.com',
    password: 'Password123',
    remindersInterval: 7
  });
  const loginRes = await request(app).post('/auth/login').send({ email: 'card@test.com', password: 'Password123' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Credit Cards CRUD', () => {
  test('POST /creditCards creates a card', async () => {
    const res = await request(app)
      .post('/creditCards')
      .set('Authorization', `Bearer ${token}`)
      .send({ cardNumber: '4111111111111111', limit: 5000, balance: 0, dueDate: '2023-12-31' })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    cardId = res.body._id;
  });

  test('GET /creditCards returns list', async () => {
    const res = await request(app)
      .get('/creditCards')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(c => c._id === cardId)).toBe(true);
  });

  test('GET /creditCards/:id returns the card', async () => {
    const res = await request(app)
      .get(`/creditCards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id', cardId);
  });

  test('PUT /creditCards/:id updates the card', async () => {
    const res = await request(app)
      .put(`/creditCards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ balance: 100 })
      .expect(200);
    expect(res.body).toHaveProperty('balance', 100);
  });

  test('DELETE /creditCards/:id removes the card', async () => {
    await request(app)
      .delete(`/creditCards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get(`/creditCards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
