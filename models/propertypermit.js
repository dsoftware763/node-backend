'use strict';
module.exports = (sequelize, DataTypes) => {
  const propertyPermit = sequelize.define('propertyPermit', {
    name: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  propertyPermit.associate = function(models) {
    // associations can be defined here
    propertyPermit.hasMany(models.property);
    propertyPermit.hasMany(models.propertyUnitSpace);
  };
  return propertyPermit;
};