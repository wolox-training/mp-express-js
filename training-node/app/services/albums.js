const axios = require('axios'),
  albumsURL = 'https://jsonplaceholder.typicode.com/albums',
  errors = require('../errors'),
  logger = require('../logger');

exports.findAll = () =>
  axios
    .get(albumsURL)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      logger.error('Error fetching albums', err);
      return errors.defaultError('Error fetching albums');
    });
