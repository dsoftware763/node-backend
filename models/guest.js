'use strict';
module.exports = (sequelize, DataTypes) => {
  const guest = sequelize.define('guest', {
    userId: DataTypes.INTEGER,
    hostUserId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    nationality: DataTypes.STRING,
    licencePlate: DataTypes.STRING,
    fromDate: DataTypes.DATEONLY,
    toDate: DataTypes.DATEONLY,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  guest.associate = function(models) {
    // associations can be defined here
    guest.belongsTo(models.user);
    
    guest.belongsTo(models.user, {
      foreignKey: 'hostUserId',
      as: 'UserId'
    });
  };
  return guest;
};