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

describe('albums', () => {
  describe('/albums POST', () => {
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
});
