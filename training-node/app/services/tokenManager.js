const jwt = require('jwt-simple'),
  session = require('../../config').common.session,
  logger = require('../logger'),
  moment = require('moment');

const SECRET = session.secret;

exports.HEADER_NAME = session.header_name;

exports.encode = email => {
  const expiration = parseInt(session.expiration);
  const nbf = parseInt(moment().unix());
  logger.info(`About to generate token with expiration of ${expiration} seconds`);
  return jwt.encode({ exp: nbf + expiration, nbf, email }, SECRET);
};

exports.decode = token => jwt.decode(token, SECRET);
