const request = require('supertest');
const express = require('express');
const handler = require('./contact');

// Wrap the serverless handler in an express route for testing
const app = express();
app.use(express.json());
app.post('/api/contact', (req, res) => handler(req, res));

describe('Vercel /api/contact', () => {
  test('returns 400 when name/email missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('accepts and logs when SMTP is not configured', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Test', email: 'test@example.com', message: 'Hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});