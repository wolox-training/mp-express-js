const request = require('request-promise'),
  albumsURL = 'https://jsonplaceholder.typicode.com/albums',
  errors = require('../errors'),
  logger = require('../logger');

exports.findAll = () =>
  request({
    json: true,
    uri: albumsURL
  }).catch(err => {
    logger.error('Error fetching albums', err);
    return errors.defaultError('Error fetching albums');
  });
