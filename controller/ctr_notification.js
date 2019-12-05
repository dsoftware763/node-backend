"use strict";
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
var error_handler = require("./error_handler.js");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
var salt = bcrypt.genSaltSync(saltRounds);
const user_role_superadmin = 1;
const user_role_admin = 2;
const user_role_parkingstaff = 3;
const user_role_resident = 4;
const user_role_guest = 5;
const user_role_manager = 6;

exports.AddNotification = function(req, res, next) {
    var MakenotificationFor = '';
    switch (req.body.notificationFor) {
        case "all":
                 MakenotificationFor = JSON.stringify(['all']);
                 break;

        case "specific_role":
                 MakenotificationFor = JSON.stringify(req.body.notificationForSpecRole);
                 break;

        case "specific_user":
                 MakenotificationFor = JSON.stringify(req.body.notificationForSpecUser);
                 break;

        default:
             MakenotificationFor = [];
             break;
    }
    dbinstance.notification.create({ 
        notificationText: req.body.notificationText, 
        notificationPriority: req.body.notificationPriority, 
        category: req.body.category,
        notificationFor:JSON.parse(MakenotificationFor),
        notificationBy:req.body.notificationBy,
        createdAt: new Date()
    }
    ).then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "Error while adding Notification." });
        } else {
            res.json({ status: "success", response: "Notification added successfully." });
        }
      })
}

exports.GetAllNotifications = function(req, res, next) {
    dbinstance.notification
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UserId',
                attributes: []
            }],

           
            attributes: ["id","notificationText","category","notificationPriority","notificationFor","createdAt",
                [Sequelize.col("UserId.id"), "PublishedById"],
                [Sequelize.col("UserId.userName"), "PublishedByUserName"],
                [Sequelize.col("UserId.email"), "PublishedByUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No Notification Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};






exports.GetAllNotificationsPublishedByMe = function(req, res, next) {
    dbinstance.notification
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UserId',
                attributes: []
            }],

           
            attributes: ["id","notificationText","category","notificationPriority","notificationFor","createdAt",
                [Sequelize.col("UserId.id"), "PublishedById"],
                [Sequelize.col("UserId.userName"), "PublishedByUserName"],
                [Sequelize.col("UserId.email"), "PublishedByUserEmail"]
            ],

            where: {
                'notificationBy': req.body.userId
            }, 
            raw: true
        })
        .then(resultset => {
            //console.log(resultset);
            if (resultset === null) {
                res.json({ status: "error", response: "No Notification Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};






exports.GetAllNotificationsForMe = function(req, res, next) {
    
    const SearchCriteriaRole = '"'+req.body.userRole+'"';
    const SearchCriteriaId = '"'+req.body.userId+'"';

    dbinstance.notification
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UserId',
                attributes: []
            }],

            attributes: ["id","notificationText","category","notificationPriority","notificationFor","createdAt",
                [Sequelize.col("UserId.id"), "PublishedById"],
                [Sequelize.col("UserId.userName"), "PublishedByUserName"],
                [Sequelize.col("UserId.email"), "PublishedByUserEmail"]
            ],
           
            where: {
                [Sequelize.Op.or]: [
                    {
                        notificationFor: 
                        {
                            [Sequelize.Op.substring]: '"all"'
                        }
                    }, 
                    {
                        notificationFor: 
                        {
                            [Sequelize.Op.substring]: SearchCriteriaRole
                        }
                    }, 
                    {
                        notificationFor: 
                        {
                            [Sequelize.Op.substring]: SearchCriteriaId
                        }
                    }
                ]
            },
            raw: true
        })
        .then(resultset => {
            //console.log(resultset);
            if (resultset === null) {
                res.json({ status: "error", response: "No Notification Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

