module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('connection', {
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  }
});

  Connection.associate = (models) => {
    models.Connection.belongsTo(models.User);
    models.Connection.belongsTo(models.Pet);
    models.Connection.hasMany(models.Message);
  };

  return Connection;
};