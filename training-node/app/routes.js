const users = require('./controllers/user'),
  userMiddle = require('./middlewares/user'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', [userMiddle.validate], users.create);
  app.post('/users/sessions', [], users.login);
  app.get('/users', [auth.require], users.findAll);
  app.post('/users/admin', [userMiddle.validate, auth.require], users.createUpdateAdmin);
};
