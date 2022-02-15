const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const app = require('../build/index');
const request = require('supertest');

test('ping', () => {
  return request(app.api)
    .get(`/ping`)
    .expect(200)
    .then((response) => {
      expect(response.text).toBe('{"message":"pong"}');
    });

});

test('add and test a new get route', () => {
  const message = {
    "hello": "world"
  };

  app.api.get('/test', (req, res) => {
    res.status(200).json(message);
  });

  return request(app.api)
    .get(`/test`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toMatchObject(message);
    });
});

test('check if default route leads to 404', () => {
  app.catchAll();

  return request(app.api)
    .get(`/`)
    .expect('Content-Type', /json/)
    .expect(404)
    .then((response) => {
      expect(response.body).toMatchObject({message: 'Not found.'});
    });
});

app.server.close();
