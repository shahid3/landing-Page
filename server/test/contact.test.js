const request = require('supertest');
const app = require('../index');

describe('POST /api/contact', () => {
  test('rejects when name or email missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('accepts and logs when SMTP not configured', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Test', email: 'test@example.com', message: 'Hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
