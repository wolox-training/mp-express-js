const errors = require('../errors');

exports.validate = (request, response, next) => {
  const user = request.body
    ? {
        name: request.body.name,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password
      }
    : {};

  if (!(user.name && user.lastName && user.email && user.password)) {
    next(errors.savingError('Body request must contain name, lastName, email and password'));
  } else {
    request.user = user;
    next();
  }
};
