const userServices = require('../services/user'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcrypt');

const validateUser = user => {
  const validation = {
    message: '',
    isValid: true
  };
  if (
    user.password &&
    (user.password.length < 8 || !user.password.match('([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)'))
  ) {
    validation.isValid = false;
    validation.message = 'Password of user must be alphanumeric and 8 characters minimum';
    return validation;
  }

  if (user.email && !user.email.match('^[A-Za-z0-9._%+-]+@wolox.com.ar')) {
    validation.isValid = false;
    validation.message = 'Email invalid';
    return validation;
  }

  return validation;
};

exports.create = (request, response, next) => {
  const SALT_ROUNDS = 10;
  bcrypt
    .hash(request.user.password, SALT_ROUNDS)
    .then(hashPass => {
      const validation = validateUser(request.user);

      if (validation.isValid) {
        const userHash = request.user;
        userHash.password = hashPass;

        userServices
          .create(userHash)
          .then(userSaved => {
            logger.info(`New user created with email [${userSaved.email}]`);
            response.status(200).end();
          })
          .catch(err => {
            logger.error(`Error creating user with email [${request.user.email}]`);
            next(err);
          });
      } else {
        next(errors.savingError(validation.message));
      }
    })
    .catch(error => errors.defaultError(error));
};
