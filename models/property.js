'use strict';
module.exports = (sequelize, DataTypes) => {
  const property = sequelize.define('property', {
    name: DataTypes.STRING,
    propertyTypeId: DataTypes.INTEGER,
    propertyAreaLocalityId: DataTypes.INTEGER,
    propertyPermitId: DataTypes.INTEGER,
    vehicleCapacity: DataTypes.INTEGER,
    residentOwnerId: DataTypes.INTEGER,
    visitorStayLengthInDays: DataTypes.INTEGER,
    noOfVisitorVehiclesAtTime: DataTypes.INTEGER,
    noOfvisitorVehicleAllowedInAMonth: DataTypes.INTEGER,
    isEnabled: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  }, {});
  property.associate = function(models) {
    // associations can be defined here
    // property.belongsTo(models.user);
    property.belongsTo(models.user, {
      foreignKey: 'residentOwnerId',
      as: 'UserId'
  });

    // property.hasMany(models.propertyType);
    property.belongsTo(models.propertyType, {
      foreignKey: 'propertyTypeId',
      as: 'PropertyTypeId'
    });

    // property.hasMany(models.propertyAreaLocality);
    property.belongsTo(models.propertyAreaLocality, {
      foreignKey: 'propertyAreaLocalityId',
      as: 'PropertyAreaLocalityId'
    });

    property.belongsTo(models.propertyPermit, {
      foreignKey: 'propertyPermitId',
      as: 'PropertyPermitId'
    });
    property.hasMany(models.propertyUnitSpace);
  };


  property.afterBulkCreate(function(records) {
    records.map(aa => {
      const name = "Unit" + "-" + aa.propertyAreaLocalityId.toString() + "-" + aa.id.toString();
      aa.update({name: name})
    })
    return records
  })

  // property.afterCreate(async function(record) {
  //     const name = "Unit" + "-" + record.propertyAreaLocalityId.toString() + "-" + record.id.toString();
  //     const rec = await record.update({name: name})
  //     if(rec){
  //       return record
  //     }
  // })

  return property;
};