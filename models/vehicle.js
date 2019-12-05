'use strict';
module.exports = (sequelize, DataTypes) => {
  const vehicle = sequelize.define('vehicle', {
    vehicleOptMakeId: DataTypes.INTEGER,
    vehicleOptModelId: DataTypes.INTEGER,
    vehicleOptYear: DataTypes.STRING,
    vehicleOptColor: DataTypes.STRING,
    vehicleOptChastype: DataTypes.STRING,
    vehicleOptWheeltype: DataTypes.STRING,
    ownerUsersId: DataTypes.INTEGER,
    optStateId: DataTypes.INTEGER,
    countryID: DataTypes.STRING(3) + ' CHARSET utf8 COLLATE utf8_general_ci',
    licencePlateNumber: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  vehicle.associate = function(models) {
    // associations can be defined here
    // vehicle.belongsTo(models.user);

    vehicle.belongsTo(models.user, {
      foreignKey: 'ownerUsersId',
      as: 'UserId'
  });
  
  vehicle.belongsTo(models.optState, {
    foreignKey: 'optStateId'
  });

  vehicle.belongsTo(models.optCountry, {
    foreignKey: 'countryID'
  });
    vehicle.belongsTo(models.vehicleOptMake);
    vehicle.belongsTo(models.vehicleOptModel);
    vehicle.hasMany(models.propertyUnitSpace);
  };
  return vehicle;
};