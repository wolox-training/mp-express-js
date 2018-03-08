const bcrypt = require('bcrypt');
const User = require('../').users;

exports.execute = () =>
  bcrypt
    .hash('1234567a', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          name: 'admin',
          lastName: 'admin',
          email: 'admin@wolox.com.ar',
          password: hash,
          typeUser: 'A'
        })
      );
      data.push(
        User.create({
          name: 'common',
          lastName: 'common',
          email: 'common@wolox.com.ar',
          password: hash,
          typeUser: 'R'
        })
      );
      return Promise.all(data);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
