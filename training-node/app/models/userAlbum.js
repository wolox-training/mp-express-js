module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'userAlbums',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args: 'uniqueIndex',
          msg: 'This album has already been purchased by this user'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args: 'uniqueIndex',
          msg: 'This album has already been purchased by this user'
        },
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      timestamps: false
    },
    {
      indexes: [{ fields: ['userId', 'albumId'], unique: true }]
    }
  );
