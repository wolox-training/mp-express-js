'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'tokenKey', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'tokenKey')
};
