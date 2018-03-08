const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize');

const notifyErrorDatabase = e => {
  logger.error('Database error', e);
  return Promise.reject(errors.defaultError('Database error'));
};

const handleValidationError = e => {
  if (e instanceof Sequelize.ValidationError) {
    return Promise.reject(errors.badRequest(e.errors));
  } else {
    return notifyErrorDatabase(e);
  }
};

exports.create = user => User.create(user).catch(handleValidationError);

exports.update = user => User.update(user, { where: { email: user.email } }).catch(handleValidationError);

exports.findByEmail = email => User.findOne({ where: { email } }).catch(notifyErrorDatabase);

exports.search = (offset = 0, limit = 50) =>
  User.findAndCountAll({ offset, limit }).catch(notifyErrorDatabase);

exports.createOrUpdate = user =>
  exports
    .findByEmail(user.email)
    .then(userFound => {
      if (userFound) {
        return exports.update(user);
      } else {
        return exports.create(user);
      }
    })
    .catch(notifyErrorDatabase);
