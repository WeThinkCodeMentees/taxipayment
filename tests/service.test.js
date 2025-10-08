const request = require('supertest');
const express = require('express');
const sinon = require('sinon');

// Mock auth middleware to inject a fake user
function fakeAuth(req, res, next) {
  req.user = { uid: 'test-user-id' };
  next();
}

describe('POST /services', () => {
  let app;
  let firestoreStub;
  let getServiceRouter;
  let createServiceController;
  let mockAdmin;

  beforeEach(() => {
    jest.resetModules(); // Clear require cache
    mockAdmin = {
      firestore: function() {
        return {
          collection: () => ({
            add: async (data) => ({ id: 'mock-service-id' })
          })
        };
      }
    };
    mockAdmin.firestore.FieldValue = { serverTimestamp: () => 'mock-timestamp' };
    getServiceRouter = require('../backend/routes/serviceRoutes');
    createServiceController = require('../backend/controllers/serviceController').createServiceController;
    app = express();
    app.use(express.json());
    app.use('/', getServiceRouter(fakeAuth, createServiceController(mockAdmin)));
  });

  afterEach(() => {
    sinon.restore();
    jest.resetModules();
  });

  it('should create a service with valid data', async () => {
    const res = await request(app)
      .post('/services')
      .send({
        title: 'Test Service',
        price: 100,
        location: 'Test City',
        category: 'Transport',
        contact: '1234567890'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', 'mock-service-id');
    expect(res.body).toHaveProperty('ownerId', 'test-user-id');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/services')
      .send({ title: 'Missing Fields' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 if user is not authenticated', async () => {
    function noAuth(req, res, next) { next(); }
    const noAuthApp = express();
    noAuthApp.use(express.json());
    noAuthApp.use('/', getServiceRouter(noAuth, createServiceController(mockAdmin)));
    const res = await request(noAuthApp)
      .post('/services')
      .send({
        title: 'Test Service',
        price: 100,
        location: 'Test City',
        category: 'Transport',
        contact: '1234567890'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
