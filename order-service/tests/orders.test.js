import { jest } from '@jest/globals';
import request from 'supertest';

// Create mocked DB and API modules using Jest ESM unstable mocks
const mockDb = {
  query: jest.fn(),
  getConnection: jest.fn()
};

await jest.unstable_mockModule('../db.js', () => ({ default: mockDb }));
await jest.unstable_mockModule('../utils/api.js', () => ({
  validateUser: async () => true,
  getPaymentStatus: async () => 'PAID'
}));

const { default: app } = await import('../server.js');

describe('Order Service basic endpoints', () => {
  test('GET / health check', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /orders returns array (no orders)', async () => {
    mockDb.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /orders creates order (mocked DB connection)', async () => {
    const fakeConnection = {
      beginTransaction: jest.fn(),
      query: jest.fn()
        .mockResolvedValueOnce([{ insertId: 1 }]) // insert order
        .mockResolvedValueOnce() // insert order_items
        .mockResolvedValueOnce(), // insert history
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn()
    };

    mockDb.getConnection.mockResolvedValueOnce(fakeConnection);

    const orderPayload = { user_id: 1, items: [{ product_id: 10, quantity: 2, price: 5.0 }] };
    const res = await request(app).post('/orders').send(orderPayload).set('Authorization', 'Bearer token');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('orderId');
  });
});
