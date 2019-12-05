'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vehicleOptMakeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehicleOptMakes',
          key: 'id'
        }
      },
      vehicleOptModelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehicleOptModels',
          key: 'id'
        }
      },
      vehicleOptYear: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleOptColor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleOptChastype: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicleOptWheeltype: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      ownerUsersId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      optStateId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'optStates',
          key: 'stateID'
        }
      },
      countryID: {
        type: Sequelize.STRING(3) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: true,
        references: {
          model: 'optCountries',
          key: 'countryID'
        },
      },
      licencePlateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('vehicles');
  }
};