module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('pet', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    hobbies: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    profileImage: {
      type :DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Pet.associate = (models) => {
    models.Pet.belongsTo(models.User);
    models.Pet.belongsToMany(models.User, {  as: 'Matcheduser', through: models.Connection, foreignKey: 'petId' });

  };
  
  return Pet;
};
