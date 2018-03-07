const USER_REGULAR = 'R';
const USER_ADMIN = 'A';

exports.USER_ADMIN;
exports.USER_REGULAR;

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
        allowNull: false,
        defaultValue: USER_REGULAR
      }
    },
    {
      timestamps: false
    }
  );
