const errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

exports.notifyErrorDatabase = e => {
  logger.error('Database error', e);
  return Promise.reject(errors.defaultError('Database error'));
};

exports.handleValidationError = (e, msg) => {
  if (e instanceof Sequelize.ValidationError) {
    return Promise.reject(errors.badRequest(msg || e.errors));
  } else {
    return exports.notifyErrorDatabase(e);
  }
};
