'use strict';
module.exports = (sequelize, DataTypes) => {
  const optCountry = sequelize.define('optCountry', {
    countryID: { type: DataTypes.STRING(3), primaryKey: true},
    countryName: DataTypes.STRING(52),
    localName: DataTypes.STRING(45),
    webCode: DataTypes.STRING(2),
    region: DataTypes.STRING(26),
    continent: DataTypes.ENUM('Asia','Europe','North America','Africa','Oceania','Antarctica','South America'),
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    surfaceArea: DataTypes.FLOAT(10,2),
    population: DataTypes.INTEGER(11),
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  optCountry.associate = function(models) {
    // associations can be defined here
    optCountry.hasMany(models.propertyAreaLocality, {
      foreignKey: 'countryID',
      as: 'Countrys'
    });


    optCountry.hasMany(models.optState, {
      foreignKey: 'countryID',
      as: 'Country'
    });

    optCountry.hasMany(models.optCity, {
      foreignKey: 'countryID',
      as: 'City'
    });

  };
  return optCountry;
};