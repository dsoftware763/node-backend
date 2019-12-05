'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('optCountries', [{
      "countryID": "USA",
      "countryName": "USA",
      "localName": "United States",
      "webCode": "US",
      "region": "North America",
      "continent": "North America",
      "latitude": "38",
      "longitude": "-97",
      "surfaceArea": "9363520.00",
      "population": "278357000",
      "isEnabled": 1
    },
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('optCountries', null, {});
  }
};
