const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  usersTest = require('./users'),
  should = chai.should(),
  tokenManager = require('../app/services/tokenManager'),
  config = require('../config'),
  nock = require('nock');

nock(config.common.apiExternal)
  .get('/albums/5')
  .times(3)
  .reply(200, {
    userId: 1,
    id: 5,
    title: 'eaque aut omnis a'
  });

nock(config.common.apiExternal)
  .get('/photos?albumId=5')
  .times(2)
  .reply(200, [
    {
      albumId: 5,
      id: 201,
      title: 'nesciunt dolorum consequatur ullam tempore accusamus debitis sit',
      url: 'http://placehold.it/600/250289',
      thumbnailUrl: 'http://placehold.it/150/250289'
    },
    {
      albumId: 5,
      id: 202,
      title: 'explicabo vel omnis corporis debitis qui qui',
      url: 'http://placehold.it/600/6a0f83',
      thumbnailUrl: 'http://placehold.it/150/6a0f83'
    },
    {
      albumId: 5,
      id: 203,
      title: 'labore vel voluptate ipsum quaerat debitis velit',
      url: 'http://placehold.it/600/3a5c29',
      thumbnailUrl: 'http://placehold.it/150/3a5c29'
    }
  ]);

const buyAlbum = (token, id = 5) =>
  chai
    .request(server)
    .post(`/albums/${id}`)
    .set(tokenManager.HEADER_NAME, token);

describe('photos', () => {
  describe('/users/albums/:id/photos GET', () => {
    it('should success search of photos (regular user)', done =>
      usersTest.successCommonAuth().then(res => {
        const TOKEN = res.headers[tokenManager.HEADER_NAME];
        return buyAlbum(TOKEN).then(() =>
          chai
            .request(server)
            .get('/users/albums/5/photos')
            .set(tokenManager.HEADER_NAME, TOKEN)
            .then(response => {
              dictum.chai(response);
              response.should.have.status(200);
              response.body.should.have.length(3);
              done();
            })
        );
      }));
    it('should success search of photos (admin user)', done =>
      usersTest.successAdminAuth().then(res => {
        const TOKEN = res.headers[tokenManager.HEADER_NAME];
        return buyAlbum(TOKEN).then(() =>
          chai
            .request(server)
            .get('/users/albums/5/photos')
            .set(tokenManager.HEADER_NAME, TOKEN)
            .then(response => {
              response.should.have.status(200);
              response.body.should.have.length(3);
              done();
            })
        );
      }));
    it('should fail search of photos because not purchase this album', done =>
      usersTest.successAdminAuth().then(res => {
        const TOKEN = res.headers[tokenManager.HEADER_NAME];
        return buyAlbum(TOKEN).then(() =>
          chai
            .request(server)
            .get('/users/albums/11/photos')
            .set(tokenManager.HEADER_NAME, TOKEN)
            .catch(err => {
              err.response.should.have.status(400);
              err.response.body.should.have.property('error');
              done();
            })
        );
      }));
    it('should fail search of photos because user is not authorized', done =>
      chai
        .request(server)
        .get('/users/albums/11/photos')
        .catch(err => {
          err.response.should.have.status(401);
          err.response.body.should.have.property('error');
          done();
        }));
  });
});
