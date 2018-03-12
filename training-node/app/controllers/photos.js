const albumsServices = require('../services/albums'),
  errors = require('../errors'),
  logger = require('../logger'),
  photosServices = require('../services/photos');

exports.findByAlbum = (request, response, next) =>
  albumsServices
    .findUniqueBy({ userId: request.userLogged.id, albumId: request.params.albumId })
    .then(album => {
      logger.info(
        `User with id -> ${request.userLogged.id} request photos for album with id -> ${
          request.params.albumId
        }`
      );
      if (album) {
        return photosServices.findAll(request.params.albumId).then(photos => {
          logger.info(
            `Success to retrieve photos for album ${request.params.albumId} for user with id -> ${
              request.userLogged.id
            }`
          );
          response.status(200);
          response.send(photos);
        });
      } else {
        logger.info(
          `Fail to retrieve photos for album ${request.params.albumId} for user with id -> ${
            request.userLogged.id
          } because album is not purchased`
        );
        return Promise.reject(errors.badRequest('Album not purchased'));
      }
    })
    .catch(next);
