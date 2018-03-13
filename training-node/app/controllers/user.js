const userServices = require('../services/user'),
  constants = require('./constants'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcrypt'),
  tokenManager = require('../services/tokenManager'),
  validations = require('./validations'),
  SALT_ROUNDS = 10,
  config = require('../../config');

const validateUser = (user, userLogged, role) => {
  const validation = {
    isValid: true,
    messages: []
  };
  validations.validateEmail(user, validation);
  validations.validatePassword(user, validation);
  if (userLogged) {
    validations.validateTypeUser(userLogged, validation, role);
  }
  return validation;
};

const validateLogin = user => {
  const validation = {
    isValid: true,
    messages: []
  };
  validations.validateLogin(user, validation);
  validations.validateEmail(user, validation);
  return validation;
};

const createUpdateUser = (userData, creator, role = constants.USER_REGULAR, method = 'create') => {
  return bcrypt.hash(userData.password, SALT_ROUNDS).then(hashPass => {
    const validation = validateUser(userData, creator, role);

    if (validation.isValid) {
      const userHash = userData;
      userHash.password = hashPass;
      userHash.typeUser = role;

      return userServices[method](userHash)
        .then(userSaved => {
          logger.info(`Success to ${method} user with email [${userData.email}]`);
          return Promise.resolve(userSaved);
        })
        .catch(err => {
          logger.error(`Error trying to ${method} user with email [${userHash.email}]`);
          return Promise.reject(err);
        });
    } else {
      return Promise.reject(errors.badRequest(validation.messages, validation.statusCode));
    }
  });
};

exports.create = (request, response, next) => {
  return createUpdateUser(request.user)
    .then(user => response.status(200).end())
    .catch(next);
};

exports.login = (request, response, next) => {
  const userData = request.body
    ? {
        email: request.body.email,
        password: request.body.password
      }
    : {};
  const validation = validateLogin(userData);
  logger.info(`Attempt login for user ${userData.email}`);
  if (validation.isValid) {
    return userServices
      .findUniqueBy({ email: userData.email })
      .then(user => {
        if (user === null) {
          throw errors.badRequest(`User not found ${userData.email}`);
        }
        return user;
      })
      .then(user => {
        const same = bcrypt.compareSync(userData.password, user.password);
        if (same) {
          logger.info(`Success login for user ${userData.email}`);
          const token = tokenManager.encode(userData.email);
          response.status(200);
          response.set(tokenManager.HEADER_NAME, token);
          response.send({ tokenTTL: config.common.session.expiration });
        } else {
          next(errors.badRequest(`Invalid password for user ${userData.email}`));
        }
      })
      .catch(next);
  } else {
    next(errors.badRequest(validation.messages));
  }
};

exports.findAll = (request, response, next) => {
  return userServices
    .search(request.query.offset, request.query.limit)
    .then(result => {
      response.status(200);
      response.send({ results: result.rows, total: result.count });
    })
    .catch(next);
};

exports.createUpdateAdmin = (request, response, next) => {
  return createUpdateUser(request.user, request.userLogged, constants.USER_ADMIN, 'createOrUpdate')
    .then(userCreated => {
      response.status(200).end();
    })
    .catch(next);
};
