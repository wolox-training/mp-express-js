const tokenManager = require('../services/tokenManager'),
  userServices = require('../services/user'),
  errors = require('../errors');

exports.require = (request, response, next) => {
  const token = request.headers[tokenManager.HEADER_NAME];

  if (token) {
    const payload = tokenManager.decode(token);
    if (payload) {
      userServices
        .findByEmail(payload)
        .then(user => {
          if (user) {
            request.user = user;
            next();
          } else {
            next(errors.unauthorized('User not found'));
          }
        })
        .catch(e => next(errors.defaultError('Error fetching user')));
    } else {
      next(errors.unauthorized('Bad token'));
    }
  } else {
    next(errors.unauthorized('User unauthorized'));
  }
};
