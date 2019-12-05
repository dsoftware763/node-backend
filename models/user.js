'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    userRoleId: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    hashKeyExpireOn:DataTypes.DATE,
    hashKey:DataTypes.TEXT('long'),
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  user.associate = function(models) {
    // associations can be defined here
      user.belongsTo(models.userRole);
      user.hasOne(models.message);
      user.hasOne(models.guest);
      user.hasOne(models.manager);
      user.hasOne(models.parkingStaff);
      user.hasOne(models.resident);

      user.hasMany(models.property, {
        foreignKey: 'id',
        as: 'residentOwnerId'
      });
      user.hasMany(models.vehicle, {
        foreignKey: 'id',
        as: 'ownerUsersId'
      });
      user.hasMany(models.propertyStaff);
      // user.hasOne(models.vehicle);
      user.hasMany(models.propertyUnitSpace);

  };
  return user;
};