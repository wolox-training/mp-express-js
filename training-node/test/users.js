const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

const successUserCreate = () =>
  chai
    .request(server)
    .post('/users')
    .send({ name: 'martin', lastName: 'picollo', email: 'martin@wolox.com.ar', password: '12346578q' });

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
});
