// Authorization Tests for protected routes
const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // Register a user for later use (not needed for auth failures)
  await request(app).post('/auth/register').send({
    name: 'Auth User',
    email: 'auth@test.com',
    password: 'Password123',
    remindersInterval: 7,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

const protectedRoutes = [
  { method: 'get', path: '/loans' },
  { method: 'post', path: '/loans' },
  { method: 'get', path: '/investments' },
  { method: 'post', path: '/investments' },
  { method: 'get', path: '/creditCards' },
  { method: 'post', path: '/creditCards' },
  { method: 'get', path: '/subscriptions' },
  { method: 'post', path: '/subscriptions' },
];

protectedRoutes.forEach((route) => {
  test(`Unauthenticated ${route.method.toUpperCase()} ${route.path} should return 401`, async () => {
    const res = await request(app)[route.method](route.path);
    expect(res.status).toBe(401);
  });
});
