'use strict';
module.exports = (sequelize, DataTypes) => {
  const manager = sequelize.define('manager', {
    userId: DataTypes.INTEGER,
    hostUserId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    nationality: DataTypes.STRING,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  manager.associate = function(models) {
    // associations can be defined here
    manager.belongsTo(models.user);
  };
  return manager;
};