'use strict';
module.exports = (sequelize, DataTypes) => {
  const mailLogs = sequelize.define('mailLog', {
    to: DataTypes.STRING,
    subject: DataTypes.TEXT('long'),
    htmlContent: DataTypes.TEXT('long'),
    textContent: DataTypes.TEXT('long'),
    messageId: DataTypes.TEXT('long'),
    rawResponse: DataTypes.TEXT('long'),
    isResend: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  mailLogs.associate = function(models) {
    // associations can be defined here
  };
  return mailLogs;
};