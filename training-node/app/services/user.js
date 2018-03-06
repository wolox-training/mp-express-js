const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

exports.create = user =>
  User.create(user).catch(e => {
    if (e instanceof Sequelize.ValidationError) {
      throw errors.savingError(e.errors);
    } else {
      logger.error('Database error', e);
      throw errors.defaultError('Database error');
    }
  });
