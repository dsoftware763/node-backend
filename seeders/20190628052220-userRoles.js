'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('userRoles', [{
      userType: 'superadmin',
      name: 'Super Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userType: 'admin',
      name: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userType: 'parkingstaff',
      name: 'Parking staff',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userType: 'resident',
      name: 'Resident',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userType: 'guest',
      name: 'Guest',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userType: 'manager',
      name: 'Manager',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userRoles', null, {});
  }
};
