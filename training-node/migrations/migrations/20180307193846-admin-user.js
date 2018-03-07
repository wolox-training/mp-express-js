'use strict';

const User = require('../../app/models/user');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'typeUser', {
      type: Sequelize.STRING(1),
      allowNull: false,
      defaultValue: User.USER_REGULAR
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'typeUser')
};
