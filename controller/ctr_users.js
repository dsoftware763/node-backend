"use strict";
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
var error_handler = require("./error_handler.js");
var ctr_mailer = require("./ctr_mailer.js");
var ctr_vehicles = require("./ctr_vehicles.js");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
var salt = bcrypt.genSaltSync(saltRounds);
const user_role_superadmin = 1;
const user_role_admin = 2;
const user_role_parkingstaff = 3;
const user_role_resident = 4;
const user_role_guest = 5;
const user_role_manager = 6;


exports.GetAllManagersAsAdmin = function(req, res, next) {
    dbinstance.manager
        .findAll({
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "managerId"],
                ["userId", "managerUserId"],
                ["phone", "managerPhone"],
                ["dob", "managerDob"],
                ["nationality", "managerNationality"],
                ["isEnabled", "managerIsEnabled"],
                [Sequelize.col("user.id"), "managerUserId"],
                [Sequelize.col("user.userName"), "managerUserName"],
                [Sequelize.col("user.email"), "managerUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.AddManagerAsAdmin = function(req, res, next) {
    dbinstance.user
    .findOne({
        attributes: [
            "id",
            "userRoleId",
            "userName",
            "email",
            "isEnabled",
            "isDeleted"
        ],
        where: {
            [Sequelize.Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
        }
    })
    .then(user => {
        //console.log(user);
        if (user) {
            res.json({
                status: "error",
                response: "User already exist with same Username or Email."
            });
        } else {
            var hashPassword = bcrypt.hashSync(req.body.password, salt);
            dbinstance.user
                .create({
                    userName: req.body.userName,
                    userRoleId: user_role_manager,
                    email: req.body.email,
                    password: hashPassword
                })
                .then(userSignup => {
                    if (userSignup) {
                        var newUserId = userSignup.get({ plain: true }).id;

                        dbinstance.manager
                            .create({
                                userId: newUserId,
                                phone: req.body.phoneNumber,
                                dob: req.body.dob,
                                nationality: req.body.nationality
                            })
                            .then(UserInRoleTBLCreate => {
                                //console.log("ManagerCreate", UserInRoleTBLCreate);
                                if (UserInRoleTBLCreate) {
                                    res.json({
                                        status: "success",
                                        response: "Manager created successfully."
                                    });
                                } else {
                                    res.json({
                                        status: "error",
                                        response: "User created successfully but Error while creating Manager."
                                    });
                                }
                            })
                            .catch(function(err) {
                                res.json({
                                    status: "error",
                                    response: error_handler.GetCommonError(err)
                                });
                            });
                    } else {
                        res.json({
                            status: "error",
                            response: "Error while creating User & Manager."
                        });
                    }
                });
        }
    })
    .catch(function(err) {
        res.json({
            status: "error",
            response: error_handler.GetCommonError(err)
        });
    });
}



exports.GetAllParkingStaffAsAdmin = async function(req, res, next) {
    const {rowsPerPage, page, ShowAll} = req.body
    // var isEnabledOnly = true;
    let whereObj = {}
    if(ShowAll === true){
        whereObj = {}
    }else{
        whereObj = {"isEnabled":1}
    }
    let queryObj = {}
    if(req.body.rowsPerPage == undefined){
        queryObj = {
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "parkingStaffId"],
                ["userId", "parkingStaffUserId"],
                ["phone", "parkingStaffPhone"],
                ["dob", "parkingStaffDob"],
                ["nationality", "parkingStaffNationality"],
                ["isEnabled", "parkingStaffIsEnabled"],
                [Sequelize.col("user.id"), "parkingStaffUserId"],
                [Sequelize.col("user.userName"), "parkingStaffUserName"],
                [Sequelize.col("user.email"), "parkingStaffUserEmail"]
            ],
            raw: true,
            where: whereObj
        }
    }else{
        const offset = page*rowsPerPage
        queryObj = {
            offset: Number(offset),
            limit: Number(rowsPerPage),
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "parkingStaffId"],
                ["userId", "parkingStaffUserId"],
                ["phone", "parkingStaffPhone"],
                ["dob", "parkingStaffDob"],
                ["nationality", "parkingStaffNationality"],
                ["isEnabled", "parkingStaffIsEnabled"],
                [Sequelize.col("user.id"), "parkingStaffUserId"],
                [Sequelize.col("user.userName"), "parkingStaffUserName"],
                [Sequelize.col("user.email"), "parkingStaffUserEmail"]
            ],
            raw: true,
            where: whereObj
        }
    }
    const parkingStaffTotalCount = await dbinstance.parkingStaff.count()
    dbinstance.parkingStaff
        .findAll(queryObj)
        .then(resultset => {
            //console.log("LLLLLL", resultset)
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset, parkingStaffTotalCount: parkingStaffTotalCount });
            }
        });
};


exports.AddParkingStaffAsAdmin = function(req, res, next) {
    dbinstance.user
    .findOne({
        attributes: [
            "id",
            "userRoleId",
            "userName",
            "email",
            "isEnabled",
            "isDeleted"
        ],
        where: {
            [Sequelize.Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
        }
    })
    .then(user => {
        //console.log(user);
        if (user) {
            res.json({
                status: "error",
                response: "User already exist with same Username or Email."
            });
        } else {
            var hashPassword = bcrypt.hashSync(req.body.password, salt);
            dbinstance.user
                .create({
                    userName: req.body.userName,
                    userRoleId: user_role_parkingstaff,
                    email: req.body.email,
                    password: hashPassword
                })
                .then(userSignup => {
                    if (userSignup) {
                        var newUserId = userSignup.get({ plain: true }).id;

                        dbinstance.parkingStaff
                            .create({
                                userId: newUserId,
                                phone: req.body.phoneNumber,
                                dob: req.body.dob,
                                nationality: req.body.nationality
                            })
                            .then(UserInRoleTBLCreate => {
                                //console.log("parkingStaffCreate", UserInRoleTBLCreate);
                                if (UserInRoleTBLCreate) {
                                    res.json({
                                        status: "success",
                                        response: "Parking Staff created successfully."
                                    });
                                } else {
                                    res.json({
                                        status: "error",
                                        response: "User created successfully but Error while creating Parking Staff."
                                    });
                                }
                            })
                            .catch(function(err) {
                                res.json({
                                    status: "error",
                                    response: error_handler.GetCommonError(err)
                                });
                            });
                    } else {
                        res.json({
                            status: "error",
                            response: "Error while creating User & Parking Staff."
                        });
                    }
                });
        }
    })
    .catch(function(err) {
        res.json({
            status: "error",
            response: error_handler.GetCommonError(err)
        });
    });
}



exports.GetAllResidentAsAdmin = function(req, res, next) {
    dbinstance.resident
        .findAll({
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "residentId"],
                ["userId", "residentUserId"],
                ["phone", "residentPhone"],
                ["dob", "residentDob"],
                ["nationality", "residentNationality"],
                ["isEnabled", "residentIsEnabled"],
                [Sequelize.col("user.id"), "residentUserId"],
                [Sequelize.col("user.userName"), "residentUserName"],
                [Sequelize.col("user.email"), "residentUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.AddResidentAsAdmin = function(req, res, next) {
    dbinstance.user
    .findOne({
        attributes: [
            "id",
            "userRoleId",
            "userName",
            "email",
            "isEnabled",
            "isDeleted"
        ],
        where: {
            [Sequelize.Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
        }
    })
    .then(user => {
        //console.log(user);
        if (user) {
            res.json({
                status: "error",
                response: "User already exist with same Username or Email."
            });
        } else {
            var hashPassword = bcrypt.hashSync(req.body.password, salt);
            dbinstance.user
                .create({
                    userName: req.body.userName,
                    userRoleId: user_role_resident,
                    email: req.body.email,
                    password: hashPassword
                })
                .then(userSignup => {
                    if (userSignup) {
                        var newUserId = userSignup.get({ plain: true }).id;

                        dbinstance.resident
                            .create({
                                userId: newUserId,
                                phone: req.body.phoneNumber,
                                dob: req.body.dob,
                                nationality: req.body.nationality
                            })
                            .then(UserInRoleTBLCreate => {
                                //console.log("residentCreate", UserInRoleTBLCreate);
                                if (UserInRoleTBLCreate) {
                                    res.json({
                                        status: "success",
                                        response: "Parking Staff created successfully."
                                    });
                                } else {
                                    res.json({
                                        status: "error",
                                        response: "User created successfully but Error while creating Parking Staff."
                                    });
                                }
                            })
                            .catch(function(err) {
                                res.json({
                                    status: "error",
                                    response: error_handler.GetCommonError(err)
                                });
                            });
                    } else {
                        res.json({
                            status: "error",
                            response: "Error while creating User & Parking Staff."
                        });
                    }
                });
        }
    })
    .catch(function(err) {
        res.json({
            status: "error",
            response: error_handler.GetCommonError(err)
        });
    });
}


exports.GetAllGuestAsAdmin = function(req, res, next) {
    //console.log('asdasd');
    dbinstance.guest
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UserId',
                attributes: []
            },
            {
                model: dbinstance.user,
                attributes: [['userName', 'guestUserName'],['email', 'guestEmail']]
            }],
            attributes: [
                ["id", "guestId"],
                ["userId", "guestUserId"],
                ["phone", "guestPhone"],
                ["dob", "guestDob"],
                ["nationality", "guestNationality"],
                ["isEnabled", "guestIsEnabled"],
                ["hostUserId", "hostUserId"],
                [Sequelize.col("UserId.userName"), "hostUserName"],
                [Sequelize.col("UserId.email"), "hostUserEmail"]
                
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};




exports.msssgs = function(req, res, next) {
    dbinstance.message
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UsenderId',
                attributes: []
            },
            {
                model: dbinstance.user,
                as: 'UrecvrId',
                attributes: [['userName', 'guestUserName'],['email', 'guestEmail']]
            }],
            
            attributes: [
                ["id", "guestId"],
                ["senderId", "guestUserId"],
                ["receiverId", "receiverId"],
                ["message", "getmessage"],
                ["conversationId", "conversationId"],
                [Sequelize.col("UrecvrId.userName"), "hostUserName"],
                [Sequelize.col("UrecvrId.email"), "hostUserEmail"]
                
            ],
            where: {
                [Sequelize.Op.or]: [{ senderId: 1 }, { receiverId: 1 }]
            },
            group: ['conversationId'],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No message Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.Getguesttest = function(req, res, next) {
    dbinstance.guest
        .findAll({
            include: [{
                model: dbinstance.user,
                as: 'UserId',
                attributes: []
            },
            {
                model: dbinstance.user,
                attributes: []
            }],
            attributes: [
                ["id", "guestId"],
                ["userId", "guestUserId"],
                [Sequelize.col("user.userName"), "guestUserName"],
                [Sequelize.col("user.email"), "guestUserEmail"],
                ["hostUserId", "hostUserId"],
                [Sequelize.col("UserId.userName"), "hostUserName"],
                [Sequelize.col("UserId.email"), "hostUserEmail"],
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.AddGuestAsAdmin = function(req, res, next) {
    dbinstance.user
    .findOne({
        attributes: [
            "id",
            "userRoleId",
            "userName",
            "email",
            "isEnabled",
            "isDeleted"
        ],
        where: {
            [Sequelize.Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
        }
    })
    .then(user => {
        //console.log(user);
        if (user) {
            res.json({
                status: "error",
                response: "User already exist with same Username or Email."
            });
        } else {
            var hashPassword = bcrypt.hashSync(req.body.password, salt);
            dbinstance.user
                .create({
                    userName: req.body.userName,
                    userRoleId: user_role_guest,
                    email: req.body.email,
                    password: hashPassword
                })
                .then(userSignup => {
                    if (userSignup) {
                        var newUserId = userSignup.get({ plain: true }).id;

                        dbinstance.guest
                            .create({
                                userId: newUserId,
                                hostUserId: req.body.hostUserId,
                                phone: req.body.phoneNumber,
                                dob: req.body.dob,
                                nationality: req.body.nationality
                            })
                            .then(UserInRoleTBLCreate => {
                                //console.log("guestCreate", UserInRoleTBLCreate);
                                if (UserInRoleTBLCreate) {
                                    res.json({
                                        status: "success",
                                        response: "Guest created successfully."
                                    });
                                } else {
                                    res.json({
                                        status: "error",
                                        response: "User created successfully but Error while creating Guest."
                                    });
                                }
                            })
                            .catch(function(err) {
                                res.json({
                                    status: "error",
                                    response: error_handler.GetCommonError(err)
                                });
                            });
                    } else {
                        res.json({
                            status: "error",
                            response: "Error while creating User & Guest."
                        });
                    }
                });
        }
    })
    .catch(function(err) {
        res.json({
            status: "error",
            response: error_handler.GetCommonError(err)
        });
    });
}






//Manger Start
exports.GetAllParkingStaffAsManager = function(req, res, next) {
    dbinstance.parkingStaff
        .findAll({
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "parkingStaffId"],
                ["userId", "parkingStaffUserId"],
                ["phone", "parkingStaffPhone"],
                ["dob", "parkingStaffDob"],
                ["nationality", "parkingStaffNationality"],
                ["isEnabled", "parkingStaffIsEnabled"],
                [Sequelize.col("user.id"), "parkingStaffUserId"],
                [Sequelize.col("user.userName"), "parkingStaffUserName"],
                [Sequelize.col("user.email"), "parkingStaffUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.GetAllResidentAsManager = function(req, res, next) {
    dbinstance.resident
        .findAll({
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "residentId"],
                ["userId", "residentUserId"],
                ["phone", "residentPhone"],
                ["dob", "residentDob"],
                ["nationality", "residentNationality"],
                ["isEnabled", "residentIsEnabled"],
                [Sequelize.col("user.id"), "residentUserId"],
                [Sequelize.col("user.userName"), "residentUserName"],
                [Sequelize.col("user.email"), "residentUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};




async function getUserIdsIdsUnderAParkingStaff(parkingStaffId){
    try{
       const staffs = await dbinstance.propertyStaff.findAll({
            where: {
                userId: parkingStaffId,
                isEnabled: 1
            },
            attributes: ['propertyAreaLocalityId'],
        })
        const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})

        const properties = await dbinstance.property.findAll({
            group: ['residentOwnerId'],
            
            where: {
                propertyAreaLocalityId: {
                    [Sequelize.Op.or]: propertyAreaLocalityIds
                  },
                isEnabled: 1,
                residentOwnerId: {
                    [Sequelize.Op.ne]:null
                }
            },
            attributes: ['residentOwnerId'],
        })
        const residentOwnerIds = properties.map(propertiesaa => {return (propertiesaa.residentOwnerId)})


        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: residentOwnerIds
            };
        return resultSet;
    }catch(err){
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }
}


exports.GetAllGuestAsManager = async function(req, res, next) {
    const {rowsPerPage, page, userId} = req.body
    const offset = page*rowsPerPage
    const residentOwnerIdsArray = await getUserIdsIdsUnderAParkingStaff(userId);
    var residentOwnerIds = []

    if(residentOwnerIdsArray.status === 'success'){
        residentOwnerIds = residentOwnerIdsArray.response;
    }
    
    
    const guestTotalCount = await dbinstance.guest.count()
    dbinstance.guest
        .findAll({
            where: {hostUserId:{
                [Sequelize.Op.in]: residentOwnerIds
              }},
            offset: Number(offset),
            limit: Number(rowsPerPage),
            include: [{
                model: dbinstance.user,
                as: 'UserId',
                attributes: []
            },
            {
                model: dbinstance.user,
                attributes: [['userName', 'guestUserName'],['email', 'guestEmail']]
            }],
            attributes: [
                ["id", "guestId"],
                ["userId", "guestUserId"],
                ["phone", "guestPhone"],
                ["dob", "guestDob"],
                ["nationality", "guestNationality"],
                ["isEnabled", "guestIsEnabled"],
                ["hostUserId", "hostUserId"],
                [Sequelize.col("UserId.userName"), "hostUserName"],
                [Sequelize.col("UserId.email"), "hostUserEmail"]
                
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset, guestTotalCount:guestTotalCount });
            }
        });
};
// Manager end




exports.GetAllResidentAsCommon = async function(req, res, next) {
    //console.log("{{{", req.body)
    const {rowsPerPage, page} = req.body
    const offset = page*rowsPerPage
    const residentTotalCount = await dbinstance.resident.count()
    dbinstance.resident
        .findAll({
            offset: Number(offset),
            limit: Number(rowsPerPage),
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "residentId"],
                ["userId", "residentUserId"],
                ["phone", "residentPhone"],
                ["dob", "residentDob"],
                ["nationality", "residentNationality"],
                "visitorPermitAllowed",
                "visitorVehicleCanStay",
                "temporaryPermitAllowed",
                "temporaryVehicleCanLast",
                ["isEnabled", "residentIsEnabled"],
                [Sequelize.col("user.id"), "residentUserId"],
                [Sequelize.col("user.userName"), "residentUserName"],
                [Sequelize.col("user.email"), "residentUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                var promises = resultset.map(async result => {
                    const Property = await dbinstance.property.findOne({
                        where:{residentOwnerId: result.residentUserId},
                        attributes: [
                        ["name", "propertyName"]
                    ],
                    raw: true})
                    result.propertyName = Property ? Property.propertyName : ""
                    return result
                })
                Promise.all(promises).then(function(resultsets) {
                    console.log("resultset*******888", resultsets)
                    res.json({ status: "success", response: resultsets, residentTotalCount: residentTotalCount });
                })
               
            }
        });
};


function GetUserRoleIdByUserRole(UserRole, callback) {
    dbinstance.userRole
    .findOne({
        attributes: [
            "id",
            "userType",
            "name"
        ],
        where: {
            'userType': UserRole
        },
        raw: true
    }).then(
        userRoleResult => {
            callback(null, userRoleResult);
        }
    )
    .catch(function(err) {
        callback(err,null);
    });
}



exports.AddNewUserForCommon = function(req, res, next) {
     GetUserRoleIdByUserRole(req.body.userRole, function(err, UserRoleResult)  {
        if (err) {
           res.json({
                status: "error",
                response: error_handler.GetCommonError(err)
            });
        } else {
            /* Start User Adding */
            dbinstance.user
            .findOne({
                attributes: [
                    "id",
                    "userRoleId",
                    "userName",
                    "email",
                    "isEnabled",
                    "isDeleted"
                ],
                where: {
                    [Sequelize.Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
                }
            })
            .then(user => {
                //console.log(user);
                if (user) {
                    res.json({
                        status: "error",
                        response: "User already exist with same Username or Email."
                    });
                } else {
                    var hashPassword = bcrypt.hashSync(req.body.password, salt);
                    dbinstance.user
                        .create({
                            userName: req.body.userName,
                            userRoleId: UserRoleResult.id,
                            email: req.body.email,
                            password: hashPassword
                        })
                        .then(userSignup => {
                            if (userSignup) {
                                var newUserId = userSignup.get({ plain: true }).id;
                                var SignUpRole = req.body.userRole;
                                
                               
                                dbinstance[SignUpRole]
                                    .create({
                                        userId: newUserId,
                                        phone: req.body.phoneNumber,
                                        // dob: req.body.dob,
                                        nationality: req.body.nationality
                                    })
                                    .then(UserInRoleTBLCreate => {

                                        let mailInfo = ctr_mailer.mailerMethod(
                                            {
                                                "actionCase":"userRegistrationParkingStaff",
                                                "to":req.body.email,
                                                "content":
                                                {
                                                    "username":req.body.userName,
                                                    "email":req.body.email,
                                                    "password":req.body.password
                                                }
                                            })
                                    //    console.log('mailInfo',mailInfo);
                                        if (UserInRoleTBLCreate) {
                                            res.json({
                                                status: "success",
                                                response: SignUpRole+" created successfully."
                                            });
                                        } else {
                                            res.json({
                                                status: "error",
                                                response: "User created successfully but Error while creating "+SignUpRole+"."
                                            });
                                        }
                                    })
                                    .catch(function(err) {
                                        res.json({
                                            status: "error",
                                            response: error_handler.GetCommonError(err)
                                        });
                                    });
                            } else {
                                res.json({
                                    status: "error",
                                    response: "Error while creating User & "+SignUpRole+"."
                                });
                            }
                        });
                }
            })
            .catch(function(err) {
                res.json({
                    status: "error",
                    response: error_handler.GetCommonError(err)
                });
            });
            /* Ending User Adding */
        }
    });



    
}





exports.GetAllUsers = function(req, res, next) {
    dbinstance.user
        .findAll({
            include: [{
                model: dbinstance.userRole,
                attributes: [
                    // ["userType","userRoleType"]
                ]
            }],
            order: [
                ['userRoleId']
            ],
            attributes: [
                ["id", "userId"],
                ["userName", "userName"],
                ["userRoleId", "userRoleId"],
                [Sequelize.col("userRole.name"), "userRoleName"]
            ],
            raw: true
        })
        .then(resultset => {
            var resultsetModi = {};
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                for(let i=0;i<resultset.length;i++){
                    myFunction(resultset[i])
                }
                function myFunction(num) {
                    resultsetModi[num.userRoleName] = ( typeof resultsetModi[num.userRoleName] != 'undefined' && resultsetModi[num.userRoleName] instanceof Array ) ? resultsetModi[num.userRoleName] : []
                    resultsetModi[num.userRoleName].push(num);
                }
                res.json({ status: "success", response: resultsetModi });
            }
        });
};

exports.GetUsersTable = function(req, res, next) {
    dbinstance.user
        .findAll()
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.GetUserRoles = function(req, res, next) {
    dbinstance.userRole
        .findAll()
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.GetAllResidentsList = function(req, res, next) {
    dbinstance.user
    .findAll({
        where:{userRoleId: 4},
        raw: true
    })
    .then(resultsets => {
        if (resultsets === null) {
            res.json({ status: "error", response: "No user Found." });
        } else {
            var promises = resultsets.map(async result => {
                const rr = await dbinstance.vehicle.count({where:{ownerUsersId: result.id}})
                result.noOfVehiclesOwned = rr
                return result
            })
            Promise.all(promises).then(function(resultsets) {
                res.json({ status: "success", response: resultsets });
            })
        }
    });
}


exports.GetAllResiGuests = function(req, res, next) {
    dbinstance.user
        .findAll({
            include: [{
                model: dbinstance.userRole,
                attributes: [
                    // ["userType","userRoleType"]
                ]
            }],
            order: [
                ['userRoleId']
            ],
            attributes: [
                ["id", "userId"],
                ["userName", "userName"],
                ["userRoleId", "userRoleId"],
                [Sequelize.col("userRole.name"), "userRoleName"]
            ],
            where: {
                userRoleId: {
                  [Sequelize.Op.or]: [user_role_resident, user_role_guest]
                }
              },
            raw: true
        })
        .then(resultset => {
            var resultsetModi = {};
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                for(let i=0;i<resultset.length;i++){
                    myFunction(resultset[i])
                }
                function myFunction(num) {
                    resultsetModi[num.userRoleName] = ( typeof resultsetModi[num.userRoleName] != 'undefined' && resultsetModi[num.userRoleName] instanceof Array ) ? resultsetModi[num.userRoleName] : []
                    resultsetModi[num.userRoleName].push(num);
                }
                res.json({ status: "success", response: resultsetModi });
            }
        });
};


exports.GetAllResi = function(req, res, next) {
    dbinstance.user
        .findAll({
            include: [{
                model: dbinstance.userRole,
                attributes: [
                    // ["userType","userRoleType"]
                ]
            }],
            order: [
                ['userRoleId']
            ],
            attributes: [
                ["id", "userId"],
                ["userName", "userName"],
                ["userRoleId", "userRoleId"],
                [Sequelize.col("userRole.name"), "userRoleName"]
            ],
            where: {
                userRoleId: {
                  [Sequelize.Op.or]: [user_role_resident]
                }
              },
            raw: true
        })
        .then(resultset => {
            var resultsetModi = {};
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                for(let i=0;i<resultset.length;i++){
                    myFunction(resultset[i])
                }
                function myFunction(num) {
                    resultsetModi[num.userRoleName] = ( typeof resultsetModi[num.userRoleName] != 'undefined' && resultsetModi[num.userRoleName] instanceof Array ) ? resultsetModi[num.userRoleName] : []
                    resultsetModi[num.userRoleName].push(num);
                }
                res.json({ status: "success", response: resultsetModi });
            }
        });
};


async function getUnitIdsAssociateWithThesePropLocalityIds(MyLocalityIds){
    // console.log('Paramadiiids-',MyLocalityIds);
    try{
       const staffs = await dbinstance.property.findAll({
            where: {
                propertyAreaLocalityId: {
                    [Sequelize.Op.or]: MyLocalityIds
                  },
                  residentOwnerId: {[Sequelize.Op.ne]: null},
                isEnabled: 1
            },
            attributes: ['residentOwnerId'],
        })
        const propertyUnitIds = staffs.map(aa => {return (aa.residentOwnerId)})
// console.log('************residentOwnerId-',staffs);
        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: propertyUnitIds
            };
        return resultSet;
    }catch(err){
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }
}


async function getPropertylocalityIdsOfThisParkingStaff(parkingStaffId){
    try{
       const staffs = await dbinstance.propertyStaff.findAll({
            where: {
                userId: parkingStaffId,
                isEnabled: 1
            },
            attributes: ['propertyAreaLocalityId'],
        })
        const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})

        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: propertyAreaLocalityIds
            };
        return resultSet;
    }catch(err){
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }
}

exports.GetAllResidentsUnderAStaff = async function(req, res, next) {
    //console.log("{{{", req.body)
    const {rowsPerPage, page, userId} = req.body
    const MyLocalityIds = await getPropertylocalityIdsOfThisParkingStaff(userId);
    const MyUnitIds = await getUnitIdsAssociateWithThesePropLocalityIds(MyLocalityIds.response);
    // console.log('MyUnitIds--lenght//////////////////////////////////',MyUnitIds.response.length);
    // console.log('MyUnitIds--////////',MyUnitIds.response);
    const offset = page*rowsPerPage

    if(MyUnitIds.response.length > 0){
    const residentTotalCount = await dbinstance.resident.count({
        where: {
            userId: MyUnitIds.response
        }
    })
    dbinstance.resident
        .findAll({
            where: {
                userId: MyUnitIds.response
            },
            offset: Number(offset),
            limit: Number(rowsPerPage),
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "residentId"],
                ["userId", "residentUserId"],
                ["phone", "residentPhone"],
                ["dob", "residentDob"],
                ["nationality", "residentNationality"],
                "visitorPermitAllowed",
                "visitorVehicleCanStay",
                "temporaryPermitAllowed",
                "temporaryVehicleCanLast",
                ["isEnabled", "residentIsEnabled"],
                [Sequelize.col("user.id"), "residentUserId"],
                [Sequelize.col("user.userName"), "residentUserName"],
                [Sequelize.col("user.email"), "residentUserEmail"]
            ],
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                var promises = resultset.map(async result => {
                    const Property = await dbinstance.property.findOne({
                        where:{residentOwnerId: result.residentUserId},
                        attributes: [
                        ["name", "propertyName"]
                    ],
                    raw: true})
                    result.propertyName = Property ? Property.propertyName : ""
                    return result
                })
                Promise.all(promises).then(function(resultsets) {
                    // console.log("resultset*******888", resultsets)
                    res.json({ status: "success", response: resultsets, residentTotalCount: residentTotalCount });
                })
               
            }
        });

    }else{
        res.json({ status: "success", response: [], residentTotalCount: 0 });
    }
};
