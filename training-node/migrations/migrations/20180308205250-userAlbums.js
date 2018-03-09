'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('userAlbums', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        albumId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        }
      })
      .then(() =>
        queryInterface.addIndex('userAlbums', ['userId', 'albumId'], {
          indicesType: 'UNIQUE'
        })
      ),

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userAlbums');
  }
};
