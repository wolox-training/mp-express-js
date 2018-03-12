const jwt = require('jwt-simple'),
  config = require('../../config'),
  logger = require('../logger');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = user => {
  const expiration = parseInt(config.common.session.expiration);
  const nbf = parseInt(Date.now() / 1000);
  logger.info(`About to generate token with expiration of ${expiration} seconds`);
  return jwt.encode({ exp: nbf + expiration, nbf, email: user.email, tokenKey: user.tokenKey }, SECRET);
};

exports.decode = token => jwt.decode(token, SECRET);
