const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

const notifyErrorDatabase = e => {
  logger.error('Database error', e);
  return Promise.reject(errors.defaultError('Database error'));
};

exports.create = user =>
  User.create(user).catch(e => {
    if (e instanceof Sequelize.ValidationError) {
      return Promise.reject(errors.badRequest(e.errors));
    } else {
      return notifyErrorDatabase(e);
    }
  });

exports.findByEmail = email => User.findOne({ where: { email } }).catch(notifyErrorDatabase);
