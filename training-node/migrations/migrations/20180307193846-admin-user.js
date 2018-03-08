'use strict';

const constants = require('../../app/controllers/constants');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn(
      'users',
      'typeUser',
      {
        type: Sequelize.STRING(1),
        allowNull: false,
        defaultValue: constants.USER_REGULAR
      },
      {
        schema: 'public'
      }
    ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'typeUser')
};
