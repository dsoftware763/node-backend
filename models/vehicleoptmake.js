'use strict';
module.exports = (sequelize, DataTypes) => {
  const vehicleOptMake = sequelize.define('vehicleOptMake', {
    name: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  vehicleOptMake.associate = function(models) {
    // associations can be defined here
    vehicleOptMake.hasMany(models.vehicle);
    vehicleOptMake.hasMany(models.vehicleOptModel);
  };
  return vehicleOptMake;
};