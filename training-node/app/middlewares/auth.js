const tokenManager = require('../services/tokenManager'),
  userServices = require('../services/user'),
  errors = require('../errors'),
  logger = require('../logger');

exports.require = (request, response, next) => {
  const token = request.headers[tokenManager.HEADER_NAME];

  if (token) {
    let payload = null;
    try {
      payload = tokenManager.decode(token);
    } catch (err) {
      logger.error(`Error decoding token ${token}`, err);
    }
    if (payload) {
      userServices
        .findByEmail(payload)
        .then(user => {
          if (user) {
            request.userLogged = user;
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
