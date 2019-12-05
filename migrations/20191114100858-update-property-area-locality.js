'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('propertyAreaLocalities', 'lmtVstPmtMthlyAlwNumber', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after: 'isEnabled'
      }),
      queryInterface.addColumn('propertyAreaLocalities', 'lmtVstPmtMthlyAlwNumberAtOneTime', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after: 'lmtVstPmtMthlyAlwNumber'
      }),
      queryInterface.addColumn('propertyAreaLocalities', 'lmtVstPmtMthlyAlwDays', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after: 'lmtVstPmtMthlyAlwNumberAtOneTime'
      }),

      queryInterface.addColumn('propertyAreaLocalities', 'lmtTmpPmtMthlyAlwNumber', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after: 'lmtVstPmtMthlyAlwDays'
      }),
      queryInterface.addColumn('propertyAreaLocalities', 'lmtTmpPmtMthlyAlwDays', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after: 'lmtTmpPmtMthlyAlwNumber'
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('propertyAreaLocalities', 'lmtVstPmtMthlyAlwNumber'),
      queryInterface.removeColumn('propertyAreaLocalities', 'lmtVstPmtMthlyAlwNumberAtOneTime'),
      queryInterface.removeColumn('propertyAreaLocalities', 'lmtVstPmtMthlyAlwDays'),
      
      queryInterface.removeColumn('propertyAreaLocalities', 'lmtTmpPmtMthlyAlwNumber'),
      queryInterface.removeColumn('propertyAreaLocalities', 'lmtTmpPmtMthlyAlwDays'),
    ]);
  }
};