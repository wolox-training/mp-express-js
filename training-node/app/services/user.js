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

exports.search = (offset = 0, limit = 50) => User.findAll({ offset, limit }).catch(notifyErrorDatabase);

exports.count = () => User.count().catch(notifyErrorDatabase);

exports.createOrUpdate = user =>
  this.findByEmail(user.email)
    .then(userFound => {
      if (userFound) {
        return this.update(user);
      } else {
        return this.create(user);
      }
    })
    .catch(notifyErrorDatabase);
