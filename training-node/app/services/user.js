const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  Sequelize = require('sequelize'),
  errorHandler = require('./errorHandler'),
  bcrypt = require('bcrypt');

exports.create = user => User.create(user).catch(errorHandler.handleValidationError);

exports.update = user =>
  User.update(user, { where: { email: user.email } }).catch(errorHandler.handleValidationError);

exports.findUniqueBy = condition =>
  User.findOne({ where: condition }).catch(errorHandler.notifyErrorDatabase);

exports.search = (offset = 0, limit = 50) =>
  User.findAndCountAll({ offset, limit }).catch(errorHandler.notifyErrorDatabase);

exports.createOrUpdate = user =>
  exports
    .findUniqueBy({ email: user.email })
    .then(userFound => {
      if (userFound) {
        return exports.update(user);
      } else {
        return exports.create(user);
      }
    })
    .catch(errorHandler.notifyErrorDatabase);

exports.generateNewToken = user => {
  return bcrypt
    .genSalt()
    .then(newToken => {
      if (user.tokenKey === newToken) {
        return bcrypt.genSalt();
      }
      return newToken;
    })
    .then(newToken => {
      const toUpdate = {};
      toUpdate.tokenKey = newToken;
      toUpdate.email = user.email;
      return exports.update(toUpdate);
    });
};
