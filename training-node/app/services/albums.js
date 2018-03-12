const request = require('request-promise'),
  config = require('../../config'),
  albumsURL = `${config.common.apiExternal}/albums`,
  errors = require('../errors'),
  logger = require('../logger'),
  UserAlbum = require('../models').userAlbums,
  userServices = require('./user'),
  errorHandler = require('./errorHandler');

exports.findAll = () =>
  request({
    json: true,
    uri: albumsURL
  }).catch(errorHandler.errorRequest);

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
  }).catch(errorHandler.errorRequest);

exports.purchasedAlbums = userId =>
  UserAlbum.findAll({ where: { userId } })
    .then(albumsDB => Promise.all(albumsDB.map(album => exports.get(album.albumId))))
    .catch(errorHandler.notifyErrorDatabase);

exports.findUniqueBy = condition =>
  UserAlbum.findOne({ where: condition }).catch(errorHandler.notifyErrorDatabase);
