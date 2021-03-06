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
      return userServices
        .findUniqueBy({ email: payload.email })
        .then(user => {
          if (user && user.tokenKey === payload.tokenKey) {
            request.userLogged = user;
            next();
          } else {
            next(errors.unauthorized(user ? 'Invalid token' : 'User not found'));
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
