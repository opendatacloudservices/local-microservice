const app = require('../build/index');
const request = require('supertest');

test('ping', async (done) => {
  await request(app.api)
    .get(`/ping`)
    .expect(200)
    .then((response) => {
      expect(response.text).toBe('pong');
    });

  done();
});

test('add and test a new get route', async (done) => {
  const message = {
    "hello": "world"
  };

  app.api.get('/test', (req, res) => {
    res.status(200).json(message);
  });

  await request(app.api)
    .get(`/test`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toMatchObject(message);
    });

  done();
});

test('check if default route leads to 404', async (done) => {
  app.catchAll();

  await request(app.api)
    .get(`/`)
    .expect('Content-Type', /json/)
    .expect(404)
    .then((response) => {
      expect(response.body).toMatchObject({message: 'Not found.'});
    });

  done();
});

app.server.close();
