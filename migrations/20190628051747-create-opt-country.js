'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('optCountries', {
      countryID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(3) + ' CHARSET utf8 COLLATE utf8_general_ci',
      },
      countryName: {
        type: Sequelize.STRING(52) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false,
        unique: true
      },
      localName: {
        type: Sequelize.STRING(45) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      webCode: {
        type: Sequelize.STRING(2) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false,
        unique: true
      },
      region: {
        type: Sequelize.STRING(26) + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      continent: {
        type:   Sequelize.ENUM,
        values: ['Asia','Europe','North America','Africa','Oceania','Antarctica','South America'],
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
      surfaceArea: {
        type: Sequelize.FLOAT(10,2),
        allowNull: false
      },
      population: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
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
                fields: ['countryName', 'webCode', 'region', 'continent', 'surfaceArea', 'population']
            }
        ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('optCountries');
  }
};