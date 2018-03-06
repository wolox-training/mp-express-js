const users = require('./controllers/users'),
  userMiddle = require('./middlewares/user');

exports.init = app => {
  app.post('/users', [userMiddle.validate], users.create);
};
