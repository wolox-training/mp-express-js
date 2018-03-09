const albumsServices = require('../services/albums'),
  errors = require('../errors'),
  photosServices = require('../services/photos');

exports.findByAlbum = (request, response, next) =>
  albumsServices
    .findUniqueBy({ userId: request.userLogged.id, albumId: request.params.albumId })
    .then(album => {
      if (album) {
        return photosServices.findAll(request.params.albumId).then(photos => {
          response.status(200);
          response.send(photos);
        });
      } else {
        return Promise.reject(errors.badRequest('Album not purchased'));
      }
    })
    .catch(next);
