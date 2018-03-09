const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize'),
  errorHandler = require('./errorHandler');

exports.create = user => User.create(user).catch(errorHandler.handleValidationError);

exports.update = user =>
  User.update(user, { where: { email: user.email } }).catch(errorHandler.handleValidationError);

exports.findByEmail = email => User.findOne({ where: { email } }).catch(errorHandler.notifyErrorDatabase);

exports.search = (offset = 0, limit = 50) =>
  User.findAndCountAll({ offset, limit }).catch(errorHandler.notifyErrorDatabase);

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
    .catch(errorHandler.notifyErrorDatabase);
