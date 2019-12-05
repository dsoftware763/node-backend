'use strict';
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    notificationText: DataTypes.STRING,
    category: DataTypes.STRING,
    notificationPriority: DataTypes.STRING,
    notificationFor: DataTypes.JSON,
    notificationBy: DataTypes.TEXT('long'),
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN
  }, {});
  notification.associate = function(models) {
    // associations can be defined here
    notification.belongsTo(models.user, {
      foreignKey: 'notificationBy',
      as: 'UserId'
    });
  };
  return notification;
};