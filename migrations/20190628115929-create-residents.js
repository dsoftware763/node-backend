'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('residents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      visitorPermitAllowed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      visitorVehicleCanStay: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      temporaryPermitAllowed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      temporaryVehicleCanLast: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('residents');
  }
};