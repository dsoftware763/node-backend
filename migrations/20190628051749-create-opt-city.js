'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('optCities', {
      cityID: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
      },
      cityName: {
        type: Sequelize.STRING(255) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      stateID:{
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      countryID: {
        type: Sequelize.STRING(3) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      latitude: {
        type:   Sequelize.DOUBLE,
        allowNull: false
      },
      longitude: {
        type:   Sequelize.DOUBLE,
        allowNull: false
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: null,
        allowNull: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: null,
        allowNull: true
      },
      createdAt: {
        defaultValue: null,
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: null,
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true
      }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['cityID', 'cityName', 'stateID', 'countryID', 'latitude', 'longitude']
            }
        ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('optCities');
  }
};