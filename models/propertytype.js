'use strict';
module.exports = (sequelize, DataTypes) => {
  const propertyType = sequelize.define('propertyType', {
    name: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  propertyType.associate = function(models) {
    // associations can be defined here
    propertyType.hasOne(models.property);
    
  };
  return propertyType;
};