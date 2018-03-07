exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.badRequest = message => {
  return {
    statusCode: 400,
    message
  };
};

exports.unauthorized = message => {
  return {
    statusCode: 401,
    message
  };
};
