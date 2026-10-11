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

  it('GET /tasks?completed=true should return only completed tasks', async () => {
    await request(app).post('/tasks').send({ id: 3, title: 'Open task' });
    const res = await request(app).get('/tasks?completed=true');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((t) => t.completed === true));
  });

  it('GET /tasks?completed=false should return only incomplete tasks', async () => {
    await request(app).post('/tasks').send({ id: 3, title: 'Open task' });
    const res = await request(app).get('/tasks?completed=false');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, 3);
    assert.equal(res.body[0].completed, false);
  });

  it('GET /tasks should return 400 for an invalid completed value', async () => {
    const res = await request(app).get('/tasks?completed=yes');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: 'completed must be "true" or "false"' });
  });

  it('PATCH /tasks/:id/complete should mark a task as completed', async () => {
    await request(app).post('/tasks').send({ id: 3, title: 'Open task' });
    const res = await request(app).patch('/tasks/3/complete');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 3);
    assert.equal(res.body.completed, true);

    const list = await request(app).get('/tasks?completed=false');
    assert.equal(list.body.length, 0);
  });

  it('PATCH /tasks/:id/complete should return 404 when task does not exist', async () => {
    const res = await request(app).patch('/tasks/999/complete');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'Task not found' });
  });
});