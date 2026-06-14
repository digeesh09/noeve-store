const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Increase Jest timeout for async operations
jest.setTimeout(20000);

let token;
let testUserId;

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Clean up any existing test user
  await User.deleteMany({ email: 'testuser@example.com' });
});

afterAll(async () => {
  await User.deleteMany({ email: 'testuser@example.com' });
  await mongoose.connection.close();
  await mongod.stop();
});

describe('Auth Routes', () => {
  test('POST /auth/register creates a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123',
        remindersInterval: 7,
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    token = res.body.token;
    testUserId = res.body.user.id;
  });

  test('POST /auth/login authenticates existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'Password123' })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  test('GET /auth/me returns current user when authorized', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
  });
});
