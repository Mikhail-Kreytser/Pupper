module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('connection', {
  status: {
    type: DataTypes.STRING,
  }
});

  return Connection;
};