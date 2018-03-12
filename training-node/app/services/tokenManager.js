const jwt = require('jwt-simple'),
  config = require('../../config'),
  logger = require('../logger');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = email => {
  const expiration = config.common.session.expiration;
  logger.info(`About to generate token with expiration of ${expiration} seconds`);
  const nbf = Date.now() / 1000;
  const payload = { exp: parseInt(nbf) + parseInt(expiration), nbf, email };
  return jwt.encode(payload, SECRET);
};

exports.decode = token => jwt.decode(token, SECRET);
