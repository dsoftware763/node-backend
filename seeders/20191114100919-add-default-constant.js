'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('constants', [{
        metaKey: 'TestKeyTrue',
        metaValue: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        metaKey: 'TestKeyFalse',
        metaValue: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('constants', null, {});
  }
};
