'use strict';

const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
const myPlaintextPassword = 'admin@123#';

var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(myPlaintextPassword, salt);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      // {
      //   userRoleId: 1,
      //   userName: 'superadmin',
      //   email: 'superadmin@nomail.com',
      //   password: hash,
      //   createdAt: new Date()
      // },
      {
        userRoleId: 2,
        userName: 'admin',
        email: 'admin@nomail.com',
        password: hash,
        createdAt: new Date()
      },
      // {
      //   userRoleId: 3,
      //   userName: 'parkingstaff',
      //   email: 'parkingstaff@nomail.com',
      //   password: hash,
      //   createdAt: new Date()
      // },
      // {
      //   userRoleId: 4,
      //   userName: 'resident',
      //   email: 'resident@nomail.com',
      //   password: hash,
      //   createdAt: new Date()
      // },
      // {
      //   userRoleId: 5,
      //   userName: 'guest',
      //   email: 'guest@nomail.com',
      //   password: hash,
      //   createdAt: new Date()
      // },
      // {
      //   userRoleId: 6,
      //   userName: 'manager',
      //   email: 'manager@nomail.com',
      //   password: hash,
      //   createdAt: new Date()
      // }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};