'use strict';
module.exports = (sequelize, DataTypes) => {
  const userRole = sequelize.define('userRole', {
    userType: DataTypes.STRING,
    name: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  userRole.associate = function(models) {
    // associations can be defined here
    userRole.hasOne(models.user);
  };
  return userRole;
};