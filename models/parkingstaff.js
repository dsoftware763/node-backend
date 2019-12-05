'use strict';
module.exports = (sequelize, DataTypes) => {
  const parkingStaff = sequelize.define('parkingStaff', {
    userId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    nationality: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  parkingStaff.associate = function(models) {
    // associations can be defined here
    parkingStaff.belongsTo(models.user);
  };
  return parkingStaff;
};