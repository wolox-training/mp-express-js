const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

exports.create = user =>
  User.create(user).catch(e => {
    if (e instanceof Sequelize.ValidationError) {
      return Promise.reject(errors.savingError(e.errors));
    } else {
      logger.error('Database error', e);
      return Promise.reject(errors.defaultError('Database error'));
    }
  });
