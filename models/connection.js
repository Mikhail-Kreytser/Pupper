module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('connection', {
  status: {
    type: DataTypes.STRING,
  }
});

  Connection.associate = (models) => {
    models.Connection.belongsTo(models.User);
    models.Connection.belongsTo(models.Pet);
  };

  return Connection;
};