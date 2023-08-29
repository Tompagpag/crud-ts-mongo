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
        // expect(response.body[0]).toHaveProperty('content');
        // expect(response.body[0]).toHaveProperty('done');
      }),
  );
});

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
});

describe('POST /api/v1/todos', () => {
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({ content: 'mon message', done: false })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body.content).toBe('mon message');
        expect(response.body).toHaveProperty('done');
      }));
});
