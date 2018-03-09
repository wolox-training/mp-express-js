const request = require('request-promise'),
  config = require('../../config'),
  photosURL = `${config.common.apiExternal}/photos`,
  errorHandler = require('./errorHandler');

exports.findAll = albumId =>
  request({
    json: true,
    uri: `${photosURL}?albumId=${albumId}`
  }).catch(errorHandler.errorRequest);
