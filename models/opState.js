'use strict';
module.exports = (sequelize, DataTypes) => {
  const optState = sequelize.define('optState', {
    stateID: { type: DataTypes.INTEGER(11), primaryKey: true},
    stateName: DataTypes.STRING(255),
    countryID: DataTypes.STRING(3),
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  optState.associate = function(models) {
    // associations can be defined here

    optState.hasMany(models.propertyAreaLocality, {
      foreignKey: 'stateID',
      as: 'States'
    });
    
    optState.belongsTo(models.optCountry, {
      foreignKey: 'countryID',
      as: 'Country'
    });

    optState.hasMany(models.optCity, {
      foreignKey: 'stateID',
      as: 'State'
    });
  };
  return optState;
};