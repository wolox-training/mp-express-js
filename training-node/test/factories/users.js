const factoryGirl = require('factory-girl'),
  factory = factoryGirl.factory,
  SequelizeAdapter = new factoryGirl.SequelizeAdapter(),
  Models = require('../../app/models'),
  bcrypt = require('bcrypt');

factory.setAdapter(SequelizeAdapter);

factory.define('User', Models.users, {
  name: 'auto',
  lastName: 'auto',
  email: factory.seq('User.email', n => `auto${n}@wolox.com.ar`),
  password: () => bcrypt.hash('1234567a', 10),
  typeUser: 'R'
});

exports.createUser = (options = {}) => factory.create('User', options, {});

exports.buildUser = (options = {}) => factory.build('User', options, {});

exports.factory = factory;
