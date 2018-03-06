const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

const notifyErrorDatabase = e => {
  logger.error('Database error', e);
  throw errors.defaultError('Database error');
};

exports.create = user =>
  User.create(user).catch(e => {
    if (e instanceof Sequelize.ValidationError) {
      throw errors.badRequest(e.errors);
    } else {
      notifyErrorDatabase(e);
    }
  });

exports.findByEmail = email => User.findOne({ where: { email } }).catch(notifyErrorDatabase);
