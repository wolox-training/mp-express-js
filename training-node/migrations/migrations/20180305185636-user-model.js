module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('user', {
      name: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};
