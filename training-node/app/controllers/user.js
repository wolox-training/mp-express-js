const userServices = require('../services/user'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcrypt');

const validateUser = user =>
  new Promise((resolve, reject) => {
    if (
      user.password &&
      (user.password.length < 8 || !user.password.match('([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)'))
    ) {
      reject(errors.savingError('Password of user must be alphanumeric and 8 characters minimum'));
    }

    if (user.email && !user.email.match('^[A-Za-z0-9._%+-]+@wolox.com.ar')) {
      reject(errors.savingError('Email invalid'));
    }

    resolve(user);
  });

exports.create = (request, response, next) => {
  const saltRounds = 10;
  bcrypt
    .hash(request.user.password, saltRounds)
    .then(hashPass => {
      request.user.password = hashPass;
      validateUser(request.user)
        .then(userServices.create)
        .then(userSaved => {
          logger.info(`New user created with email [${userSaved.email}]`);
          response.status(200).end();
        })
        .catch(err => {
          logger.error(`Error creating user with email [${request.user.email}]`);
          next(err);
        });
    })
    .catch(error => errors.defaultError(error));
};
