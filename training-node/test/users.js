const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  config = require('./../config'),
  tokenManager = require('../app/services/tokenManager'),
  should = chai.should(),
  usersFactory = require('./factories/users');

exports.successUserCreate = email =>
  usersFactory.buildUser({ email: email || 'martin@wolox.com.ar' }).then(user =>
    chai
      .request(server)
      .post('/users')
      .send(user)
  );

const userAuth = (user, password = '1234567a') =>
  chai
    .request(server)
    .post('/users/sessions')
    .send({ email: user.email, password });

exports.successAdminAuth = () =>
  usersFactory.createUser({ email: 'admin@wolox.com.ar', typeUser: 'A' }).then(userAuth);

exports.successCommonAuth = () => usersFactory.createUser({ email: 'common@wolox.com.ar' }).then(userAuth);

const invalidate = token =>
  chai
    .request(server)
    .post('/users/sessions/invalidate_all')
    .set(tokenManager.HEADER_NAME, token);

const validatePage = (token, offset, limit) =>
  chai
    .request(server)
    .get(`/users?limit=${limit}&offset=${offset}`)
    .set(tokenManager.HEADER_NAME, token)
    .then(result => {
      result.should.have.status(200);
      result.body.should.have.property('results');
      result.body.results.should.have.length(limit);
      result.body.should.have.property('total');
      return result;
    });

describe('users', () => {
  describe('/users POST', () => {
    it('should success creation ', done =>
      exports.successUserCreate().then(res => {
        dictum.chai(res);
        done();
      }));
    it('should fail creation because of missing parameter password', done =>
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', lastName: 'picollo', email: 'martin2@wolox.com.ar' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        }));
    it('should fail creation because of missing parameter name', done =>
      chai
        .request(server)
        .post('/users')
        .send({ lastName: 'picollo', email: 'martin2@wolox.com.ar', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        }));
    it('should fail creation because of missing parameter lastName', done =>
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', email: 'martin2@wolox.com.ar', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        }));
    it('should fail creation because of missing parameter email', done =>
      chai
        .request(server)
        .post('/users')
        .send({ name: 'martin', lastName: 'picollo', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        }));
    it('should fail creation because password does not meet requirements', done =>
      usersFactory.buildUser({ password: '123' }).then(user =>
        chai
          .request(server)
          .post('/users')
          .send(user.dataValues)
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          })
      ));

    it('should fail creation because email already exist', done =>
      exports.successUserCreate().then(() =>
        usersFactory.buildUser({ email: 'martin@wolox.com.ar' }).then(user =>
          chai
            .request(server)
            .post('/users')
            .send(user.dataValues)
            .catch(err => {
              err.should.have.status(400);
              err.response.should.be.json;
              err.response.body.should.have.property('error');
              done();
            })
        )
      ));
  });

  describe('/users/sessions POST', () => {
    it('should success auth ', done =>
      exports.successCommonAuth().then(response => {
        dictum.chai(response);
        response.should.have.status(200);
        response.header.should.have.property(tokenManager.HEADER_NAME).should.not.be.null;
        done();
      }));
    it('should fail auth because incorrect password', done =>
      exports.successUserCreate().then(res =>
        chai
          .request(server)
          .post('/users/sessions')
          .send({ email: 'martin@wolox.com.ar', password: '123' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          })
      ));
    it('should fail auth because of missing property password', done =>
      exports.successUserCreate().then(res =>
        chai
          .request(server)
          .post('/users/sessions')
          .send({ email: 'martin@wolox.com.ar' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          })
      ));
    it('should fail auth because of missing property email', done =>
      exports.successUserCreate().then(res =>
        chai
          .request(server)
          .post('/users/sessions')
          .send({ password: '123' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          })
      ));
    it('should fail auth because is an invalid email', done =>
      exports.successUserCreate().then(res =>
        chai
          .request(server)
          .post('/users/sessions')
          .send({ email: 'martin@walox.com.ar', password: '12346578q' })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          })
      ));
    it('should fail auth because user does not exist', done =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'user@wolox.com.ar', password: '12346578q' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        }));
    it('should fail authorization because of expiration token', done =>
      exports.successAdminAuth().then(response => {
        const token = response.headers[tokenManager.HEADER_NAME];
        return setTimeout(
          () =>
            chai
              .request(server)
              .get('/users')
              .set(tokenManager.HEADER_NAME, token)
              .catch(err => {
                err.response.should.have.status(401);
                err.response.body.should.have.property('error');
                done();
              }),
          2000
        );
      })).timeout(3000);
  });
  describe('/users GET', () => {
    it('should success search ', done =>
      usersFactory
        .createMultiple(100)
        .then(() => exports.successCommonAuth())
        .then(response => validatePage(response.headers[tokenManager.HEADER_NAME], 0, 20))
        .then(() => userAuth({ email: 'common@wolox.com.ar' }))
        .then(response => validatePage(response.headers[tokenManager.HEADER_NAME], 20, 40))
        .then(() => userAuth({ email: 'common@wolox.com.ar' }))
        .then(response => validatePage(response.headers[tokenManager.HEADER_NAME], 40, 60))

        .then(res => {
          dictum.chai(res);
          done();
        })).timeout(8000);
    it('should fail search because is not authenticated', done =>
      chai
        .request(server)
        .get('/users')
        .catch(err => {
          err.response.should.have.status(401);
          err.response.body.should.have.property('error');
          done();
        }));
    it('should fail search because of bad token', done =>
      chai
        .request(server)
        .get('/users')
        .set(tokenManager.HEADER_NAME, 'aaaaaaaaaaaaaaaaaaaa')
        .catch(err => {
          err.response.should.have.status(401);
          err.response.body.should.have.property('error');
          done();
        }));
  });
  describe('/users/admin POST', () => {
    it('should success admin creation ', done =>
      exports.successAdminAuth().then(response =>
        usersFactory.buildUser().then(user =>
          chai
            .request(server)
            .post('/users/admin')
            .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
            .send(user.dataValues)
            .then(res => {
              dictum.chai(res);
              res.should.have.status(200);
              done();
            })
        )
      ));
    it('should success admin update ', done =>
      exports.successAdminAuth().then(response =>
        usersFactory.buildUser().then(user =>
          chai
            .request(server)
            .post('/users/admin')
            .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
            .send(user.dataValues)
            .then(res => {
              res.should.have.status(200);
              done();
            })
        )
      ));
    it('should fail admin update/create because of missing field name ', done =>
      exports.successAdminAuth().then(response =>
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
          })
      ));
    it('should fail admin update/create because of missing field lastName ', done =>
      exports.successAdminAuth().then(response =>
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
          })
      ));
    it('should fail admin update/create because of missing field password ', done =>
      exports.successAdminAuth().then(response =>
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
          })
      ));
    it('should fail admin update/create because of missing field email ', done =>
      exports.successAdminAuth().then(response =>
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
          })
      ));
    it('should fail admin update/create because of invalid field email ', done =>
      exports.successAdminAuth().then(response =>
        usersFactory.buildUser({ email: 'martin@gmail.com' }).then(user =>
          chai
            .request(server)
            .post('/users/admin')
            .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
            .send(user.dataValues)
            .catch(err => {
              err.response.should.have.status(400);
              err.response.body.should.have.property('error');
              done();
            })
        )
      ));
    it('should fail admin update/create because of invalid field password ', done =>
      exports.successAdminAuth().then(response =>
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
          })
      ));
    it('should fail admin creation because user does not have permissions', done =>
      usersFactory.buildUser().then(user =>
        exports.successCommonAuth().then(response =>
          chai
            .request(server)
            .post('/users/admin')
            .set(tokenManager.HEADER_NAME, response.headers[tokenManager.HEADER_NAME])
            .send(user.dataValues)
            .catch(err => {
              err.response.should.have.status(401);
              err.response.body.should.have.property('error');
              done();
            })
        )
      ));
    it('should fail admin creation because user is not authenticated', done =>
      usersFactory.buildUser().then(user =>
        chai
          .request(server)
          .post('/users/admin')
          .send(user.dataValues)
          .catch(err => {
            err.response.should.have.status(401);
            err.response.body.should.have.property('error');
            done();
          })
      ));
  });
});
describe('/users/sessions/invalidate_all POST', () => {
  it('should success invalidate_all ', done =>
    exports.successAdminAuth().then(auth =>
      invalidate(auth.headers[tokenManager.HEADER_NAME]).then(res => {
        res.should.have.status(200);
        dictum.chai(res);
        done();
      })
    ));
  it('should fail invalidate_all because is not authenticated', done =>
    chai
      .request(server)
      .post('/users/sessions/invalidate_all')
      .catch(err => {
        err.response.should.have.status(401);
        err.response.body.should.have.property('error');
        done();
      }));
  it('should success invalidate_all and fail service with any prev token because its invalidated ', done =>
    exports.successAdminAuth().then(() => {
      Promise.all([
        userAuth({ email: 'admin@wolox.com.ar' }),
        userAuth({ email: 'admin@wolox.com.ar' })
      ]).then(authsRes => {
        const tokens = authsRes.map(auth => auth.headers[tokenManager.HEADER_NAME]);
        return invalidate(tokens[0]).then(res => {
          res.should.have.status(200);
          return usersFactory.buildUser().then(user => {
            chai
              .request(server)
              .post('/users/admin')
              .set(tokenManager.HEADER_NAME, tokens[1])
              .send(user.dataValues)
              .catch(err => {
                err.response.should.have.status(401);
                err.response.body.should.have.property('error');
                done();
              });
          });
        });
      });
    }));
});
