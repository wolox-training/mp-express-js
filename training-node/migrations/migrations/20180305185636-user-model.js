module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};
