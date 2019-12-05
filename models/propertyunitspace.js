'use strict';
module.exports = (sequelize, DataTypes) => {
  const propertyUnitSpace = sequelize.define('propertyUnitSpace', {
    propertyAreaLocalityId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    propertyId: DataTypes.INTEGER,
    propertyPermitId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    vehicleId: DataTypes.INTEGER,
    forHandicap: DataTypes.BOOLEAN,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  propertyUnitSpace.associate = function(models) {
    // associations can be defined here
    propertyUnitSpace.belongsTo(models.propertyAreaLocality, {
      foreignKey: 'propertyAreaLocalityId',
      as: 'PropertyAreaLocalityId'
    })
    propertyUnitSpace.belongsTo(models.vehicle, {
      foreignKey: 'vehicleId',
      // as: 'Vehicle'
    })
    propertyUnitSpace.belongsTo(models.property, {
      foreignKey: 'propertyId',
      as: 'PropertyId'
    })
    propertyUnitSpace.belongsTo(models.propertyPermit, {
      foreignKey: 'propertyPermitId',
      as: 'PropertyPermitId'
    })
    propertyUnitSpace.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'UserId'
    })
  };

  propertyUnitSpace.afterBulkCreate(function(records) {
    records.map(aa => {
      const name = "Unit_Space_" + aa.id.toString();
      aa.update({name: name})
    })
    return records
  })
  // propertyUnitSpace.afterCreate(async function(record) {
  //   const name = "Unit_Space_" + record.id.toString();
  //   const rec = await record.update({name: name})
  //   if(rec){
  //     return record
  //   }
  // })

  return propertyUnitSpace;
};