"use strict";
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
var error_handler = require("./error_handler.js");

exports.GetAllmessage = function(req, res, next) {
    dbinstance.message
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UsersIds',
                attributes: []
            },
            {
                model: dbinstance.user,
                as: 'UsersIdr',
                attributes: [['userName', 'guestUserName'],['email', 'guestEmail']]
            }],
            attributes: [
                "id",
                "senderId",
                "receiverId",
                "conversationId",
                "message",
                "isred",
                [Sequelize.col("UsersIdr.userName"), "hostUserName"],
                [Sequelize.col("UsersIdr.email"), "hostUserEmail"]
                
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No msg Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};