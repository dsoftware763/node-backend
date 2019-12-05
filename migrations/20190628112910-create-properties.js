'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      propertyTypeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'propertyTypes',
          key: 'id'
        }
      },
      propertyPermitId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'propertyPermits',
          key: 'id'
        }
      },
      propertyAreaLocalityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'propertyAreaLocalities',
          key: 'id'
        }
      },
      vehicleCapacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      numberOfResereved: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      numberOfGeneral: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      
      numberOfVisitorPermitAllowed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      daysPerMonthAllowedForGuest: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      numberOfTemporaryPermitAllowed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      daysForTemporaryPermitAllowed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      residentOwnerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      visitorStayLengthInDays: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      noOfVisitorVehiclesAtTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      noOfvisitorVehicleAllowedInAMonth: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    }, {
      comment: "Units/Condo"
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('properties');
  }
};