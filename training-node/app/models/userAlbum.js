module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'userAlbums',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
