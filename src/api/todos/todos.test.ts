import request from 'supertest';

import app from '../../app';
import { Todos } from './todos.model';

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {
    // console.error(error);
  }
});

describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', async () =>
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }),
  );
});

let id = '';

describe('POST /api/v1/todos', () => {
  it('responds with an error if the todo is invalid', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({ content: '' })
      .expect(422)
      .then((response) => {
        // console.log('ZOD error message', response.body.message);
        expect(response.body).toHaveProperty('message');
      }));

  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({ content: 'mon message', done: false })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        id = response.body._id;
        expect(response.body.content).toBe('mon message');
        expect(response.body).toHaveProperty('done');
      }));
});

describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo', async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('mon message');
        expect(response.body).toHaveProperty('done');
      }));

  it('responds with a invalid ObjectID error', (done) => {
    request(app)
      .get('/api/v1/todos/adadadazzadazds')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  },
  );

  it('responds with a not found error', (done) => {
    request(app)
      .get('/api/v1/todos/64ee2f5aad12bc724e4986bd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('PUT /api/v1/todos/:id', () => {
  it('responds with a invalid ObjectID error', (done) => {
    request(app)
      .put('/api/v1/todos/adadadazzadazds')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('responds with a not found error', (done) => {
    request(app)
      .put('/api/v1/todos/64ee2f5aad12bc724e4986bd')
      .set('Accept', 'application/json')
      .send({ content: 'Mon Super MESSAGE', done: true })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('responds with a single todo', async () =>
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({ content: 'Mon Super MESSAGE', done: true })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Mon Super MESSAGE');
        expect(response.body.done).toBe(true);
        expect(response.body).toHaveProperty('done');
      }));
});
