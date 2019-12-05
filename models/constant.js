'use strict';
module.exports = (sequelize, DataTypes) => {
  const constant = sequelize.define('constant', {
    metaKey: DataTypes.STRING,
    metaValue: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  constant.associate = function(models) {
    // associations can be defined here
  };
  return constant;
};