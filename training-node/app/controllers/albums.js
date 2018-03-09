const albumsServices = require('../services/albums'),
  errors = require('../errors'),
  logger = require('../logger');

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
