'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('optStates', [{"stateID":"5","stateName":"California","countryID":"USA","latitude":"37.42","longitude":"-122.06","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"9","stateName":"Iowa","countryID":"USA","latitude":"43.03","longitude":"-96.09","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"10","stateName":"New York","countryID":"USA","latitude":"40.76","longitude":"-73.97","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"14","stateName":"New Jersey","countryID":"USA","latitude":"39.82","longitude":"-75.13","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"15","stateName":"Massachusetts","countryID":"USA","latitude":"42.56","longitude":"-72.18","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"16","stateName":"Connecticut","countryID":"USA","latitude":"41.14","longitude":"-73.26","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"19","stateName":"Florida","countryID":"USA","latitude":"28.05","longitude":"-82.36","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"24","stateName":"Texas","countryID":"USA","latitude":"30.27","longitude":"-97.74","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"28","stateName":"Armed Forces US","countryID":"USA","latitude":"31.53","longitude":"-110.36","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"32","stateName":"Tennessee","countryID":"USA","latitude":"35.04","longitude":"-89.93","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"33","stateName":"Kentucky","countryID":"USA","latitude":"39.02","longitude":"-84.56","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"35","stateName":"Georgia","countryID":"USA","latitude":"33.84","longitude":"-84.38","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"44","stateName":"Illinois","countryID":"USA","latitude":"42.05","longitude":"-88.05","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"47","stateName":"Colorado","countryID":"USA","latitude":"39.74","longitude":"-104.98","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"49","stateName":"Utah","countryID":"USA","latitude":"40.76","longitude":"-111.89","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"57","stateName":"Maryland","countryID":"USA","latitude":"39.1","longitude":"-76.88","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"72","stateName":"South Carolina","countryID":"USA","latitude":"33.92","longitude":"-80.34","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"73","stateName":"Montana","countryID":"USA","latitude":"45.77","longitude":"-110.93","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"76","stateName":"Louisiana","countryID":"USA","latitude":"29.91","longitude":"-90.05","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"84","stateName":"Washington","countryID":"USA","latitude":"47.09","longitude":"-122.65","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"87","stateName":"Pennsylvania","countryID":"USA","latitude":"40.45","longitude":"-79.99","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"93","stateName":"North Carolina","countryID":"USA","latitude":"35.75","longitude":"-78.72","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"98","stateName":"Michigan","countryID":"USA","latitude":"43.93","longitude":"-86.26","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"101","stateName":"Arkansas","countryID":"USA","latitude":"36.19","longitude":"-94.24","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"107","stateName":"Wisconsin","countryID":"USA","latitude":"44.63","longitude":"-90.2","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"129","stateName":"Ohio","countryID":"USA","latitude":"39.11","longitude":"-84.5","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"132","stateName":"New Mexico","countryID":"USA","latitude":"35.78","longitude":"-105.87","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"133","stateName":"Kansas","countryID":"USA","latitude":"37.69","longitude":"-97.34","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"136","stateName":"Oregon","countryID":"USA","latitude":"45.44","longitude":"-122.97","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"140","stateName":"Nebraska","countryID":"USA","latitude":"41.11","longitude":"-95.93","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"143","stateName":"West Virginia","countryID":"USA","latitude":"39.46","longitude":"-77.95","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"144","stateName":"Virginia","countryID":"USA","latitude":"37.13","longitude":"-76.45","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"145","stateName":"Missouri","countryID":"USA","latitude":"38.25","longitude":"-94.31","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"148","stateName":"Mississippi","countryID":"USA","latitude":"32.37","longitude":"-90.11","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"151","stateName":"Rhode Island","countryID":"USA","latitude":"41.82","longitude":"-71.41","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"163","stateName":"Indiana","countryID":"USA","latitude":"39.79","longitude":"-86.17","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"164","stateName":"Oklahoma","countryID":"USA","latitude":"34.66","longitude":"-98.48","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"175","stateName":"Minnesota","countryID":"USA","latitude":"44.98","longitude":"-93.27","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"176","stateName":"Alabama","countryID":"USA","latitude":"33.8","longitude":"-87.28","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"181","stateName":"Arizona","countryID":"USA","latitude":"33.46","longitude":"-111.99","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"186","stateName":"South Dakota","countryID":"USA","latitude":"43.72","longitude":"-98.03","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"192","stateName":"Nevada","countryID":"USA","latitude":"36.17","longitude":"-115.28","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"215","stateName":"New Hampshire","countryID":"USA","latitude":"42.87","longitude":"-71.39","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"218","stateName":"Maine","countryID":"USA","latitude":"44.08","longitude":"-70.17","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"220","stateName":"Hawaii","countryID":"USA","latitude":"21.3","longitude":"-157.79","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"249","stateName":"District of Columbia","countryID":"USA","latitude":"38.9","longitude":"-77.04","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"254","stateName":"Delaware","countryID":"USA","latitude":"39.62","longitude":"-75.7","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"305","stateName":"Idaho","countryID":"USA","latitude":"48.39","longitude":"-116.89","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"667","stateName":"Wyoming","countryID":"USA","latitude":"44.78","longitude":"-107.55","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"924","stateName":"North Dakota","countryID":"USA","latitude":"46.96","longitude":"-97.68","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"959","stateName":"Vermont","countryID":"USA","latitude":"44.49","longitude":"-73.23","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"1061","stateName":"Alaska","countryID":"USA","latitude":"61.52","longitude":"-149.57","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}, {"stateID":"5000","stateName":"International","countryID":"USA","latitude":"0","longitude":"0","isEnabled":null,"isDeleted":null,"createdAt":null,"updatedAt":null,"deletedAt":null}], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('optStates', null, {});
  }
};
