const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let token;
let loanId;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Register and login a test user
  await request(app).post('/auth/register').send({
    name: 'Loan User',
    email: 'loan@test.com',
    password: 'Password123',
    remindersInterval: 7
  });
  const loginRes = await request(app).post('/auth/login').send({ email: 'loan@test.com', password: 'Password123' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Loans CRUD', () => {
  test('POST /loans creates a loan', async () => {
    const res = await request(app)
      .post('/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 5000, interestRate: 5, termMonths: 24 })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    loanId = res.body._id;
  });

  test('GET /loans returns list', async () => {
    const res = await request(app)
      .get('/loans')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(l => l._id === loanId)).toBe(true);
  });

  test('GET /loans/:id returns the loan', async () => {
    const res = await request(app)
      .get(`/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id', loanId);
  });

  test('PUT /loans/:id updates the loan', async () => {
    const res = await request(app)
      .put(`/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'paid' })
      .expect(200);
    expect(res.body).toHaveProperty('status', 'paid');
  });

  test('DELETE /loans/:id removes the loan', async () => {
    await request(app)
      .delete(`/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get(`/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
