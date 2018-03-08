const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  tokenManager = require('../app/services/tokenManager'),
  should = chai.should();

const successUserCreate = () =>
  chai
    .request(server)
    .post('/users')
    .send({ name: 'martin', lastName: 'picollo', email: 'martin@wolox.com.ar', password: '12346578q' });

const successUserAuth = () =>
  chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'martin@wolox.com.ar', password: '12346578q' });

const successAdminAuth = () =>
  chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'admin@wolox.com.ar', password: '1234567a' });

const successCommonAuth = () =>
  chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'common@wolox.com.ar', password: '1234567a' });

describe('users', () => {
  describe('/users POST', () => {
    it('should success creation ', done => {
      successUserCreate().then(res => {
        dictum.chai(res);
        done();
      });
    });
    it('should fail creation because of missing parameter password', done => {
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', lastName: 'picollo', email: 'martin2@wolox.com.ar' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
    it('should fail creation because of missing parameter name', done => {
      chai
        .request(server)
        .post('/users')
        .send({ lastName: 'picollo', email: 'martin2@wolox.com.ar', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
    it('should fail creation because of missing parameter lastName', done => {
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', email: 'martin2@wolox.com.ar', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
    it('should fail creation because of missing parameter email', done => {
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', lastName: 'picollo', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
    it('should fail creation because password does not meet requirements', done => {
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', lastName: 'picollo', email: 'martin2@wolox.com.ar', password: '123' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
    it('should fail creation because email already exist', done => {
      successUserCreate().then(() => {
        chai
          .request(server)
          .post('/users')
          .send({ name: 'martin', lastName: 'picollo', email: 'martin@wolox.com.ar', password: '12345678a' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
  });

  describe('/users/sessions POST', () => {
    it('should success auth ', done => {
      successUserCreate().then(res => {
        successUserAuth().then(response => {
          dictum.chai(response);
          response.should.have.status(200);
          response.header.should.have.property(tokenManager.HEADER_NAME).should.not.be.null;
          done();
        });
      });
    });
    it('should fail auth because incorrect password', done => {
      successUserCreate().then(res => {
        chai
          .request(server)
          .post('/users/sessions')
          .send({ email: 'martin@wolox.com.ar', password: '123' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail auth because of missing property password', done => {
      successUserCreate().then(res => {
        chai
          .request(server)
          .post('/users/sessions')
          .send({ email: 'martin@wolox.com.ar' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail auth because of missing property email', done => {
      successUserCreate().then(res => {
        chai
          .request(server)
          .post('/users/sessions')
          .send({ password: '123' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail auth because is an invalid email', done => {
      successUserCreate().then(res => {
        chai
          .request(server)
          .post('/users/sessions')
          .send({ email: 'martin@walox.com.ar', password: '12346578q' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail auth because user does not exist', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'user@wolox.com.ar', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
  });
  describe('/users GET', () => {
    it('should success search ', done => {
      successUserCreate().then(res => {
        successUserAuth().then(response => {
          const token = response.headers[tokenManager.HEADER_NAME];

          chai
            .request(server)
            .get('/users?offset=1&size=2')
            .set(tokenManager.HEADER_NAME, token)
            .then(result => {
              dictum.chai(result);
              result.should.have.status(200);
              result.body.should.have.property('results');
              result.body.should.have.property('total');
              done();
            });
        });
      });
    });
    it('should fail search because is not authenticated', done => {
      chai
        .request(server)
        .get('/users')
        .catch(err => {
          err.response.should.have.status(401);
          err.response.body.should.have.property('error');
          done();
        });
    });
    it('should fail search because of bad token', done => {
      chai
        .request(server)
        .get('/users')
        .set(tokenManager.HEADER_NAME, 'aaaaaaaaaaaaaaaaaaaa')
        .catch(err => {
          err.response.should.have.status(401);
          err.response.body.should.have.property('error');
          done();
        });
    });
  });
  describe('/users/admin POST', () => {
    it('should success admin creation ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common2',
            lastName: 'common2',
            email: 'common2@wolox.com.ar',
            password: '12345678a'
          })
          .then(res => {
            dictum.chai(res);
            res.should.have.status(200);
            done();
          });
      });
    });
    it('should success admin update ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            lastName: 'common',
            email: 'common@wolox.com.ar',
            password: '12345678a'
          })
          .then(res => {
            res.should.have.status(200);
            done();
          });
      });
    });
    it('should fail admin update/create because of missing field name ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            lastName: 'common',
            email: 'common@wolox.com.ar',
            password: '12345678a'
          })
          .catch(err => {
            err.response.should.have.status(400);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin update/create because of missing field lastName ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            email: 'common@wolox.com.ar',
            password: '12345678a'
          })
          .catch(err => {
            err.response.should.have.status(400);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin update/create because of missing field password ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            lastName: 'common',
            email: 'common@wolox.com.ar'
          })
          .catch(err => {
            err.response.should.have.status(400);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin update/create because of missing field email ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            lastName: 'common',
            password: '12345678a'
          })
          .catch(err => {
            err.response.should.have.status(400);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin update/create because of invalid field email ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            lastName: 'common',
            email: 'martin@gmail.com',
            password: '12345678a'
          })
          .catch(err => {
            err.response.should.have.status(400);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin update/create because of invalid field password ', done => {
      successAdminAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            lastName: 'common',
            email: 'martin@wolox.com.ar',
            password: '1234'
          })
          .catch(err => {
            err.response.should.have.status(400);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin creation because user does not have permissions', done => {
      successCommonAuth().then(response => {
        chai
          .request(server)
          .post('/users/admin')
          .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
          .send({
            name: 'common',
            lastName: 'common',
            email: 'common@wolox.com.ar',
            password: '12345678a'
          })
          .catch(err => {
            err.response.should.have.status(401);
            err.response.body.should.have.property('error');
            done();
          });
      });
    });
    it('should fail admin creation because user is not authenticated', done => {
      chai
        .request(server)
        .post('/users/admin')
        .send({
          name: 'common',
          lastName: 'common',
          email: 'common@wolox.com.ar',
          password: '12345678a'
        })
        .catch(err => {
          err.response.should.have.status(401);
          err.response.body.should.have.property('error');
          done();
        });
    });
  });
});
