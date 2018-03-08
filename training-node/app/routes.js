const users = require('./controllers/user'),
  userMiddle = require('./middlewares/user');

exports.init = app => {
  app.post('/users', [userMiddle.validate], users.create);
  app.post('/users/sessions', [], users.login);
};
