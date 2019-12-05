'use strict';
module.exports = (sequelize, DataTypes) => {
  const optCity = sequelize.define('optCity', {
    cityID: { type: DataTypes.INTEGER(11), primaryKey: true},
    cityName: DataTypes.STRING(255),
    stateID:DataTypes.INTEGER(11),
    countryID: DataTypes.STRING(3),
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  optCity.associate = function(models) {
    // associations can be defined here
    optCity.hasMany(models.propertyAreaLocality, {
      foreignKey: 'cityID',
      as: 'City'
    });

    optCity.belongsTo(models.optCountry, {
          foreignKey: 'countryID',
          as: 'Country'
        });
    optCity.belongsTo(models.optState, {
      foreignKey: 'stateID',
      as: 'State'
    });
    
  };
  return optCity;
};