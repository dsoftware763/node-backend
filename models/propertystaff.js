'use strict';
module.exports = (sequelize, DataTypes) => {
  const propertyStaff = sequelize.define('propertyStaff', {
    userId: DataTypes.INTEGER,
    propertyAreaLocalityId: DataTypes.INTEGER,
    isAssistant: DataTypes.BOOLEAN,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  propertyStaff.associate = function(models) {
    // associations can be defined here
    propertyStaff.belongsTo(models.propertyAreaLocality);
    propertyStaff.belongsTo(models.user, {
      foreignKey: 'userId'
    });
  };
  return propertyStaff;
};