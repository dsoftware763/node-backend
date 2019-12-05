'use strict';
module.exports = (sequelize, DataTypes) => {
  const vehicleOptModel = sequelize.define('vehicleOptModel', {
    name: DataTypes.STRING,
    vehicleOptMakeId: DataTypes.INTEGER,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  vehicleOptModel.associate = function(models) {
    // associations can be defined here
    vehicleOptModel.hasMany(models.vehicle);
    vehicleOptModel.belongsTo(models.vehicleOptMake);
  };
  return vehicleOptModel;
};