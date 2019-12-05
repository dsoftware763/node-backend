'use strict';
module.exports = (sequelize, DataTypes) => {
  const propertyAreaLocality = sequelize.define('propertyAreaLocality', {
    name: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    countryID: DataTypes.STRING,
    stateID: DataTypes.INTEGER,
    cityID: DataTypes.INTEGER,
    zip: DataTypes.STRING,

    numberOfUnits: DataTypes.INTEGER,
    numberOfSpacesTotal: DataTypes.INTEGER,
    numberOfSpacesHandicap: DataTypes.INTEGER,
    numberOfSpacesReserved: DataTypes.INTEGER,
    numberOfSpacesGeneral: DataTypes.INTEGER,


    lmtVstPmtMthlyAlwNumber:DataTypes.INTEGER,
    lmtVstPmtMthlyAlwNumberAtOneTime:DataTypes.INTEGER,
    lmtVstPmtMthlyAlwDays:DataTypes.INTEGER,
    lmtTmpPmtMthlyAlwNumber:DataTypes.INTEGER,
    lmtTmpPmtMthlyAlwDays:DataTypes.INTEGER,

    isEnabled: DataTypes.BOOLEAN,
    isSetupByManager: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  propertyAreaLocality.associate = function(models) 
  {
    propertyAreaLocality.belongsTo(models.optCity, {
      foreignKey: 'cityID',
      as: 'City'
    });

    propertyAreaLocality.belongsTo(models.optCountry, {
      foreignKey: 'countryID',
      as: 'Countrys'
    });

    propertyAreaLocality.belongsTo(models.optState, {
      foreignKey: 'stateID',
      as: 'States'
    });
    // associations can be defined here
    propertyAreaLocality.hasOne(models.property);
    
    propertyAreaLocality.hasMany(models.propertyStaff);
    propertyAreaLocality.hasMany(models.propertyUnitSpace);
  };
  return propertyAreaLocality;
};