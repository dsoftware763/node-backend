'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('mailLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      subject: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      htmlContent: {
        type: Sequelize.TEXT('long'),
      },
      textContent: {
        type: Sequelize.TEXT('long'),
      },
      messageId: {
        type: Sequelize.TEXT('long'),
      },
      rawResponse: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      isResend: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('mailLogs');
  }
};