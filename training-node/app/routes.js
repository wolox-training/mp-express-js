const users = require('./controllers/user'),
  albums = require('./controllers/albums'),
  photos = require('./controllers/photos'),
  userMiddle = require('./middlewares/user'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', [userMiddle.validate], users.create);
  app.post('/users/sessions', [], users.login);
  app.get('/users', [auth.require], users.findAll);
  app.post('/users/admin', [userMiddle.validate, auth.require], users.createUpdateAdmin);
  app.get('/albums', [auth.require], albums.findAll);
  app.post('/albums/:albumId', [auth.require], albums.buy);
  app.get('/users/:userId/albums', [auth.require], albums.findByUser);
  app.get('/users/albums/:albumId/photos', [auth.require], photos.findByAlbum);
  app.post('/users/sessions/invalidate_all', [auth.require], users.invalidateSessions);
};
