const request = require('request-promise'),
  albumsURL = 'https://jsonplaceholder.typicode.com/albums',
  errors = require('../errors'),
  logger = require('../logger'),
  UserAlbum = require('../models').userAlbums,
  errorHandler = require('./errorHandler');

const errorRequest = err => {
  logger.error('Error fetching albums', err);
  return Promise.reject(errors.fetchAlbums(err.statusCode));
};

exports.findAll = () =>
  request({
    json: true,
    uri: albumsURL
  }).catch(errorRequest);

exports.buy = (userId, albumId) =>
  exports
    .get(albumId)
    .then(() =>
      UserAlbum.create({ userId, albumId }).catch(err =>
        errorHandler.handleValidationError(err, 'This album was already purchased by the user')
      )
    );

exports.get = albumId =>
  request({
    json: true,
    uri: `${albumsURL}/${albumId}`
  }).catch(errorRequest);
