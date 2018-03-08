const userServices = require('../services/user'),
  constants = require('./constants'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcrypt'),
  tokenManager = require('../services/tokenManager'),
  validations = require('./validations'),
  SALT_ROUNDS = 10;

const validateUser = user => {
  const validation = {
    isValid: true,
    messages: []
  };
  validations.validateEmail(user, validation);
  validations.validatePassword(user, validation);
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

const validateAdmin = (user, logged) => {
  const validation = validateUser(user);
  validations.validateTypeUser(logged, validation, constants.USER_ADMIN);
  return validation;
};

exports.create = (request, response, next) => {
  return bcrypt
    .hash(request.user.password, SALT_ROUNDS)
    .then(hashPass => {
      const validation = validateUser(request.user);

      if (validation.isValid) {
        const userHash = request.user;
        userHash.password = hashPass;

        return userServices
          .create(userHash)
          .then(userSaved => {
            logger.info(`New user created with email [${userHash.email}]`);
            response.status(200).end();
          })
          .catch(err => {
            logger.error(`Error creating user with email [${userHash.email}]`);
            next(err);
          });
      } else {
        next(errors.badRequest(validation.messages));
      }
    })
    .catch(error => errors.defaultError(error));
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
      .findByEmail(userData.email)
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
          response.end();
        } else {
          throw errors.badRequest(`Invalid password for user ${userData.email}`);
        }
      })
      .catch(next);
  } else {
    next(errors.badRequest(validation.messages));
  }
};

exports.search = (request, response, next) => {
  return userServices
    .search(request.query.offset, request.query.limit)
    .then(users => {
      return userServices
        .count()
        .then(countUsers => {
          response.status(200);
          response.json({ results: users, total: countUsers });
        })
        .catch(next);
    })
    .catch(next);
};

exports.createUpdateAdmin = (request, response, next) => {
  return bcrypt
    .hash(request.user.password, SALT_ROUNDS)
    .then(hashPass => {
      const validation = validateAdmin(request.user, request.userLogged);

      if (validation.isValid) {
        const userHash = request.user;
        userHash.password = hashPass;
        userHash.typeUser = constants.USER_ADMIN;

        return userServices
          .createOrUpdate(userHash)
          .then(userSaved => {
            logger.info(`New admin user created/updated with email [${userSaved.email}]`);
            response.status(200).end();
          })
          .catch(err => {
            logger.error(`Error creating admin user with email [${request.user.email}]`);
            next(err);
          });
      } else {
        next(errors.badRequest(validation.messages, validation.statusCode));
      }
    })
    .catch(error => errors.defaultError(error));
};
