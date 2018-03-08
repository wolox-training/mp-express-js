module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'users',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'This email already exist'
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      typeUser: {
        type: DataTypes.STRING(1),
        allowNull: false
      }
    },
    {
      timestamps: false
    }
  );
