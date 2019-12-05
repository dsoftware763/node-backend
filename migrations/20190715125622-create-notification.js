'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      notificationText: {
        type: Sequelize.TEXT('long'),
        defaultValue: null,
        allowNull: true
      },
      notificationPriority: {
        type: Sequelize.STRING,
        defaultValue: 'success',
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      },
      notificationFor: {
        type: Sequelize.JSON,
        defaultValue: null,
        allowNull: true
      },
      notificationBy: {
        defaultValue: null,
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifications');
  }
};