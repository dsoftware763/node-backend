'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('propertyAreaLocalities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      countryID: {
        type: Sequelize.STRING(3) + ' CHARSET utf8 COLLATE utf8_general_ci',
        references: {
          model: 'optCountries',
          key: 'countryID'
        },
        allowNull: false
      },
      stateID: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'optStates',
          key: 'stateID'
        },
        allowNull: false
      },
      cityID: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'optCities',
          key: 'cityID'
        },
        allowNull: false
      },
      zip: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
      },
      numberOfUnits: {
        allowNull: true,
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      numberOfSpacesTotal: {
        allowNull: true,
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      numberOfSpacesHandicap: {
        allowNull: true,
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      numberOfSpacesReserved: {
        allowNull: true,
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      numberOfSpacesGeneral: {
        allowNull: true,
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      isSetupByManager: {
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
    }, {
      comment: "Property Complex/Building"
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('propertyAreaLocalities');
  }
};