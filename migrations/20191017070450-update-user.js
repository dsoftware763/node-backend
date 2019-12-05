'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', 'hashKey', {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        after: 'password'
      }),
      queryInterface.addColumn('users', 'hashKeyExpireOn', {
        defaultValue: null,
        allowNull: true,
        type: Sequelize.DATE,
        after: 'hashKey'      
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'hashKey'),
      queryInterface.removeColumn('users', 'hashKeyExpireOn')
    ]);
  }
};