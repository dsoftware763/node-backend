const fs = require('fs');
require('dotenv').config(); // this is important!
module.exports = {
   development : {
      username :  process.env.DEV_DATABASE_USER ,
      password :  process.env.DEV_DATABASE_PASS ,
      database :  process.env.DEV_DATABASE_NAME ,
      host     :  process.env.DEV_DATABASE_HOST ,
      dialect  :  'mysql' ,
      operatorsAliases : false,
      logging: function (str) {
         console.log('DEV-ENV-'+str);
     }
  },
   test : {
      username :  'root' ,
      password :  'root' ,
      database :  'american_sqls' ,
      host     :  'localhost' ,
      dialect  :  'mysql' ,
      operatorsAliases : false,
      logging: function (str) {
         console.log('TEST-ENV-'+str);
     }
  },
   production : {
      username :  process.env.PROD_DATABASE_USER ,
      password :  process.env.PROD_DATABASE_PASS ,
      database :  process.env.PROD_DATABASE_NAME ,
      host     :  process.env.PROD_DATABASE_HOST ,
      dialect  :  'mysql' ,
      operatorsAliases : false,
      logging: function (str) {
         console.log('PROD-ENV-'+str);
     }
  }
};
