const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

describe('Task API Baseline Tests', () => {
  beforeEach(() => {
    app.resetState();
  });

  it('GET /tasks should return all baseline tasks', async () => {
    const res = await request(app).get('/tasks');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.equal(res.body[0].title, 'Setup repository');
  });

  it('POST /tasks should create a new task', async () => {
    const newTask = { id: 3, title: 'Write tests', description: 'Automated test suite' };
    const res = await request(app).post('/tasks').send(newTask);
    assert.equal(res.status, 201);
    assert.equal(res.body.id, 3);
    assert.equal(res.body.completed, false);
  });

  it('POST /tasks should return 400 when required fields are missing', async () => {
    const res = await request(app).post('/tasks').send({ description: 'Missing id and title' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'id and title are required fields');
  });
});