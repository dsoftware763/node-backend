'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('guests', 'licencePlate', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'isEnabled'
      }),
      queryInterface.addColumn('guests', 'fromDate', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'licencePlate'
      }),
      queryInterface.addColumn('guests', 'toDate', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'fromDate'
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('guests', 'licencePlate'),
      queryInterface.removeColumn('guests', 'fromDate'),
      queryInterface.removeColumn('guests', 'toDate')
    ]);
  }
};