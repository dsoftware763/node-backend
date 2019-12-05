'use strict';
module.exports = (sequelize, DataTypes) => {
  const resident = sequelize.define('resident', {
    userId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    nationality: DataTypes.STRING,
    visitorPermitAllowed:DataTypes.INTEGER,
    visitorVehicleCanStay:DataTypes.INTEGER,
    temporaryPermitAllowed:DataTypes.INTEGER,
    temporaryVehicleCanLast: DataTypes.INTEGER,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  resident.associate = function(models) {
    // associations can be defined here
    resident.belongsTo(models.user);
  };
  return resident;
};