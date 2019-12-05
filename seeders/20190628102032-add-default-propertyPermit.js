'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('propertyPermits', [
      {name:'RESIDENT_PARKING_PERMIT',createdAt: new Date()},
      {name:'RESERVED_PERMIT',createdAt: new Date()},
      {name:'VISITOR_PERMIT',createdAt: new Date()},
      {name:'TEMPORARY_PERMIT',createdAt: new Date()},
      {name:'HANDICAP',createdAt: new Date()},
      {name:'VISITOR_SPACES',createdAt: new Date()}
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('propertyPermits', null, {});
  }
};
