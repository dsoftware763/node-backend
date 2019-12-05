'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('propertyTypes', [
      {name:'Apartment',createdAt: new Date()},
      {name:'Villa',createdAt: new Date()}
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('propertyTypes', null, {});
  }
};
