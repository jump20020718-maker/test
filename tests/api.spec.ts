import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app';

const app = createApp();

describe('api endpoints', () => {

  it('GET / serves chat page', async () => {
    const r = await request(app).get('/');
    expect(r.status).toBe(200);
    expect(r.text).toContain('AI 客服 Agent');
  });

  it('POST /api/chat', async () => {
    const r = await request(app).post('/api/chat').send({ message: '订单号ORD1001清关状态' });
    expect(r.status).toBe(200);
    expect(r.body.intent).toBe('customs_query');
  });

  it('GET /api/orders/:id', async () => {
    const r = await request(app).get('/api/orders/ORD1001');
    expect(r.status).toBe(200);
    expect(r.body.id).toBe('ORD1001');
  });

  it('GET /api/customs/:id', async () => {
    const r = await request(app).get('/api/customs/ORD1002');
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('held');
  });

  it('GET /api/logistics/:id', async () => {
    const r = await request(app).get('/api/logistics/ORD1003');
    expect(r.status).toBe(200);
    expect(r.body.carrier).toBeTruthy();
  });
});
