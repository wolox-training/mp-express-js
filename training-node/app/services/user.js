const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

exports.create = user =>
  User.create(user)
    .catch(Sequelize.ValidationError, e => {
      throw errors.savingError(e.errors);
    })
    .catch(Sequelize.Error, e => {
      logger.error('Database error', e);
      throw errors.defaultError('Database error');
    });
