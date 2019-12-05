'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('propertyUnitSpaces', {
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
      propertyAreaLocalityId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'propertyAreaLocalities',
          key: 'id'
        }
      },
      propertyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'properties',
          key: 'id'
        }
      },
      propertyPermitId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'propertyPermits',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vehicles',
          key: 'id'
        }
      },
      forHandicap: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('propertyUnitSpaces');
  }
};