const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  usersTest = require('./users'),
  should = chai.should(),
  tokenManager = require('../app/services/tokenManager'),
  nock = require('nock');

nock('https://jsonplaceholder.typicode.com')
  .get('/albums')
  .reply(200, [
    {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    },
    {
      userId: 1,
      id: 2,
      title: 'sunt qui excepturi placeat culpa'
    },
    {
      userId: 1,
      id: 3,
      title: 'omnis laborum odio'
    }
  ]);

nock('https://jsonplaceholder.typicode.com')
  .get('/albums/1')
  .reply(200, {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  });

nock('https://jsonplaceholder.typicode.com')
  .get('/albums/1')
  .times(3)
  .reply(200, {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  });

nock('https://jsonplaceholder.typicode.com')
  .get('/albums/2')
  .reply(200, {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa'
  });

nock('https://jsonplaceholder.typicode.com')
  .get('/albums/3')
  .reply(200, {
    userId: 1,
    id: 3,
    title: 'omnis laborum odio'
  });

nock('https://jsonplaceholder.typicode.com')
  .get('/albums/4')
  .reply(404, {});

const buyAlbum = (id = 1) =>
  usersTest.successCommonAuth().then(res => {
    const TOKEN = res.headers[tokenManager.HEADER_NAME];
    return chai
      .request(server)
      .post(`/albums/${id}`)
      .set(tokenManager.HEADER_NAME, TOKEN);
  });

describe('albums', () => {
  describe('/albums GET', () => {
    it('should success search of albums ', done => {
      usersTest.successCommonAuth().then(res => {
        const TOKEN = res.headers[tokenManager.HEADER_NAME];
        chai
          .request(server)
          .get('/albums')
          .set(tokenManager.HEADER_NAME, TOKEN)
          .then(response => {
            response.should.have.status(200);
            response.body.should.have.length(3);
            dictum.chai(response);
            done();
          });
      });
    });
    it('should fail search of albums because is not authorized', done => {
      chai
        .request(server)
        .get('/albums')
        .catch(err => {
          err.response.should.have.status(401);
          done();
        });
    });
  });

  describe('/albums/:albumId POST', () => {
    it('should success buy of album ', done => {
      buyAlbum().then(response => {
        response.should.have.status(200);
        dictum.chai(response);
        done();
      });
    });
    it('should fail buy of album because album does not exist', done => {
      usersTest.successCommonAuth().then(res => {
        const TOKEN = res.headers[tokenManager.HEADER_NAME];
        chai
          .request(server)
          .post('/albums/4')
          .set(tokenManager.HEADER_NAME, TOKEN)
          .catch(err => {
            err.response.should.have.status(404);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should success buy of album because is not authorized', done => {
      chai
        .request(server)
        .post('/albums/1')
        .catch(err => {
          err.response.should.have.status(401);
          done();
        });
    });
    it('should fail second buy of album because album with id 1 was already purchased', done => {
      buyAlbum(1).then(() => {
        buyAlbum(1).catch(err => {
          err.response.should.have.status(400);
          err.response.body.should.have.property('error');
          done();
        });
      });
    });
  });
});
