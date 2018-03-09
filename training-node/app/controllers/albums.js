const albumsServices = require('../services/albums'),
  errors = require('../errors'),
  logger = require('../logger'),
  constants = require('./constants');

const validateSameOrAdmin = (logged, userId) => {
  const validation = {
    isValid: true,
    messages: []
  };
  if (logged.typeUser !== constants.USER_ADMIN && logged.id !== userId) {
    validation.isValid = false;
    validation.messages.push({ message: 'User does not have permission' });
  }
  return validation;
};

exports.findAll = (request, response, next) =>
  albumsServices
    .findAll()
    .then(albums => {
      response.status(200);
      response.send(albums);
    })
    .catch(next);

exports.buy = (request, response, next) => {
  logger.info(`User ${request.userLogged.email} attempt to buy album with id ${request.params.albumId}`);

  return albumsServices
    .buy(request.userLogged.id, request.params.albumId)
    .then(() => {
      logger.info(`User ${request.userLogged.email} success to buy album with id ${request.params.albumId}`);
      response.status(200);
      response.end();
    })
    .catch(next);
};

exports.findByUser = (request, response, next) => {
  const validation = validateSameOrAdmin(request.userLogged, parseInt(request.params.userId));

  if (validation.isValid) {
    return albumsServices
      .purchasedAlbums({ userId: request.params.userId })
      .then(albums => {
        response.status(200);
        response.send(albums);
      })
      .catch(next);
  } else {
    next(errors.badRequest(validation.messages));
  }
};
