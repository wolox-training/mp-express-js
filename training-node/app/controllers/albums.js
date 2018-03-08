const albumsServices = require('../services/albums'),
  errors = require('../errors');

exports.findAll = (request, response, next) =>
  albumsServices
    .findAll()
    .then(albums => {
      response.status(200);
      response.send(albums);
    })
    .catch(next);
