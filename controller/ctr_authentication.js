"use strict";
var jwt = require("jsonwebtoken");
var dbinstance = require("../models/index");
var Op = require("sequelize").Op;
var error_handler = require("./error_handler.js");
var ctr_mailer = require("./ctr_mailer.js");
var moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
var salt = bcrypt.genSaltSync(saltRounds);
const default_vehicle_capacity = 1;
const default_propertyAreaLocalityId = 1;
const default_propertyTypeId = 1;
var Sequelize = require("sequelize");
const user_role_superadmin = 1;
const user_role_admin = 2;
const user_role_parkingstaff = 3;
const user_role_resident = 4;
const user_role_guest = 5;
const user_role_manager = 6;




exports.forgot = async function(req, res, next) {
    const identity = req.body.identity
    const userResult = await dbinstance.user.findOne({
        where: {
            [Op.or]: [{ email: identity }, { userName: identity }]
        },
        raw: true
    })
    
    if(userResult){
        if(userResult.isEnabled === 1 && userResult.isDeleted === 0){
            var hashKeyExpireOn = new Date();
            hashKeyExpireOn.setDate(hashKeyExpireOn.getDate() + 1);
            const hashKey = bcrypt.hashSync(hashKeyExpireOn+identity, salt).replace(/\//g, "-");
            const HashGenrated = await dbinstance.user.update({
                hashKeyExpireOn:hashKeyExpireOn,
                hashKey:hashKey
            }, {
                where: {
                    id: userResult.id
                }
            })
            
            if(HashGenrated){

                let mailInfo = await ctr_mailer.mailerMethod(
                    {
                        "actionCase":"sendForgotPasswordLink",
                        "to":userResult.email,
                        // "to":"prabhjot.s.kbihm.com@gmail.com",
                        "content":
                        {
                            "username":userResult.userName,
                            "email":userResult.email,
                            "token":hashKey,
                            "tokenexpireon":hashKeyExpireOn
                        }
                    })

                    
                    if(mailInfo.status === 'success'){
                        res.json({
                            status: "success",
                            response: "An email is sent to the user's registered email address. Link in the email is valid for 24 Hours only."
                        });
                    }else{
                        res.json({
                            status: "error",
                            response: "Unable to send email due to server error."
                        });
                    }

                
            }else{
                res.json({
                    status: "error",
                    response: "An unknown error occured"
                });
            }
           
            
        }else{
            res.json({                
                status: "error",
                response: "User is disabled. Please contact Administrator."
            });
        }
    }else{
        res.json({
                status: "error",
                response: "User not found."
            });
    }

};

exports.modifyPasswordWithOldPassword = async function(req, res, next){
    const id = req.body.userId
    const newPassword = req.body.password
    const oldPassword = req.body.oldPassword

    const userResult = await dbinstance.user.findOne({
        where: { id:id },
        raw: true
    })  
  
    if(userResult){
        if(userResult.isEnabled === 1){

            bcrypt.compare(oldPassword, userResult.password, async function(err, result) { 
                if(result){
                    let resapplyNewPassword = await applyNewPassword(id,newPassword);
                    if(resapplyNewPassword.status === 'success'){
                        res.json({
                            status: "success",
                            response: "Password successfully change."
                        });
                    }else{
                        res.json({
                            status: "error",
                            response: "Something went wrong."
                        });
                    }
                    
                }else{
                    res.json({
                        status: "error",
                        response: "You entered a wrong old password."
                    });
                }
            })
        
        }else{
            res.json({
                status: "error",
                response: "User is disabled by Administrator."
            });
        }
        
       
    }else{
        res.json({
            status: "error",
            response: "User not found."
        });
    }
}

exports.recoverPasswordWithHash = async function(req, res, next){
    const token = req.body.token
    const newPassword = req.body.password
    const userResult = await dbinstance.user.findOne({
        where: { hashKey: token },
        raw: true
    })  
    if(userResult){
        
        const CurrentTime = new Date().getTime();
        const ExpTime = new Date(userResult.hashKeyExpireOn).getTime();
        if(ExpTime > CurrentTime){
            let resapplyNewPassword = await applyNewPassword(userResult.id,newPassword);
            if(resapplyNewPassword.status === 'success'){
                res.json({
                    status: "success",
                    response: "Password successfully change."
                });
            }else{
                res.json({
                    status: "error",
                    response: "Something went wrong."
                });
            }
            
        }else{
            res.json({
                status: "error",
                response: "Token Expired."
            });
        }

    }else{
        res.json({
            status: "error",
            response: "Invalid Token."
        });
    }
    
}

async function generaterandomemail() {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 25; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result+"-"+Date.now()+"@generaterandom.email";
 }


async function applyNewPassword(userId,password){
    var hashPassword = bcrypt.hashSync(password, salt);

    let userResult = await dbinstance.user.findOne({where: {id:userId}})

    if(userResult){
        let resUpdatePass = await dbinstance.user.update(
            {
                password: hashPassword,
                hashKey:null, 
                hashKeyExpireOn: null
            },
            {
                returning: true,
                where: {
                    id: userId
                } 
            }
          )


          if(resUpdatePass){

            let mailInfo = await ctr_mailer.mailerMethod(
            {
                "actionCase":"sendConfirmationOfNewpasswordApply",
                "to":userResult.email,
                "content":
                {
                    "username":userResult.userName,
                    "email":userResult.email,
                    "password":password
                }
            })

            
                return {
                    status: "success",
                    response: "Password successfully change."
                };
            
        }else{
            return {
                status: "error",
                response: "Something went wrong."
            };
        }
    }else{
        return {
            status: "error",
            response: "User Not found."
        };
    }
    


     
}

exports.login = function(req, res, next) {
    dbinstance.user
        .findOne({
            include: [{
                model: dbinstance.userRole,
                attributes: []
            }],
            attributes: [
                "id",
                "userRoleId",
                [Sequelize.col("userRole.userType"), "userRoleType"],
                "userName",
                "password",
                "email",
                "isEnabled",
                "isDeleted"
            ],
            where: {
                [Op.or]: [{ email: req.body.identity }, { userName: req.body.identity }],
                [Op.and]: [{userRoleId: req.body.userRoleId}]
            }
        })
        .then(user => {
            if (user === null) {
                res.json({ status: "error", response: "No User Found." });
            } else {
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    delete user.dataValues.password;
                    if (result) {
                        
                        if(user.dataValues.isEnabled === false){
                            res.json({
                                status: "error",
                                response: "This account is disabled by admin."
                            });
                        }else{
                            res.json({
                                status: "success",
                                 response: jwt.sign({ user }, process.env.JWTSECRET)
                            });
                        }
                        
                    } else {
                        res.json({
                            status: "error",
                            response: "You entered a Wrong Password."
                        });
                    }
                });
            }
        });
};





exports.createResident = function(req, res, next) {
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
                [Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
            }
        })
        .then(user => {
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
                            let newUserId = userSignup.get({ plain: true }).id;
                         
    
                                dbinstance.resident
                                    .create({
                                        userId: newUserId,
                                        phone: req.body.phoneNumber,
                                        
                                    })
                                    .then(residentCreate => {
                                       
                                        dbinstance.property
                                        .create({
                                            name: req.body.apartmentNumber,
                                            propertyTypeId: default_propertyTypeId,
                                            propertyAreaLocalityId: default_propertyAreaLocalityId,
                                            vehicleCapacity: default_vehicle_capacity,
                                            residentOwnerId: newUserId
                                        })
                                        .then(propertyCreate => {
                                            if (propertyCreate) {
                                                res.json({
                                                    status: "success",
                                                    response: "User & Property created successfully."
                                                });
                                            } else {
                                                res.json({
                                                    status: "error",
                                                    response: "User created successfully but Error while creating Property."
                                                });
                                            }
                                        });


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
                                response: "Error while creating user & property."
                            });
                        }
                    });
            }
        });
};

exports.createResidentByStaff = function(req, res, next) {

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
                [Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
            }
        })
        .then(async user => {
            const vehicleWithSamePlateCount = await dbinstance.vehicle.count({where: {licencePlateNumber: req.body.carLicencePlateNum}})
            const plateErrorMessage = (vehicleWithSamePlateCount == 0) ? ", Licence plate Number already exits" : ""
            if (user) {
                res.json({
                    status: "error",
                    response: "User already exist with same Username or Email" + plateErrorMessage
                });
            } else {
                if (vehicleWithSamePlateCount == 0)
                {var hashPassword = bcrypt.hashSync(req.body.password, salt);
                dbinstance.user
                    .create({
                        userName: req.body.userName,
                        userRoleId: user_role_resident,
                        email: req.body.email,
                        password: hashPassword
                    })
                    .then(userSignup => {
                        if (userSignup) {

                            let mailInfo = ctr_mailer.mailerMethod(
                                {
                                    "actionCase":"userRegistrationResident",
                                    "to":req.body.email,
                                    "content":
                                    {
                                        "username":req.body.userName,
                                        "email":req.body.email,
                                        "password":req.body.password
                                    }
                                })

                            let newUserId = userSignup.get({ plain: true }).id;
                                dbinstance.resident
                                    .create({
                                        userId: newUserId,
                                        phone: req.body.phoneNumber,
                                        
                                    })
                                    .then(residentCreate => {
                                        // dbinstance.property
                                        // .create({
                                        //     name: req.body.apartmentNumber,
                                        //     propertyTypeId: default_propertyTypeId,
                                        //     propertyAreaLocalityId: default_propertyAreaLocalityId,
                                        //     vehicleCapacity: default_vehicle_capacity,
                                        //     residentOwnerId: newUserId
                                        // })
                                        // .then(propertyCreate => {
                                            if (residentCreate) {
                                                dbinstance.vehicle
                                                .create({
                                                    ownerUsersId: newUserId,
                                                    vehicleOptMakeId: req.body.carMake,
                                                    vehicleOptModelId: req.body.carModel,
                                                    vehicleOptColor: req.body.carColour,
                                                    vehicleOptYear: req.body.carYear,
                                                    licencePlateNumber: req.body.carLicencePlateNum,
                                                    vehicleOptChastype: req.body.carChassiType,
                                                    optStateId: req.body.vehicleState,
                                                    countryID: 'USA'
                                                })
                                                .then(vehicleAdd => {
                                                    if(vehicleAdd){
                                                        dbinstance.property
                                                        .update({ residentOwnerId: newUserId }, {
                                                            where: {
                                                                id: req.body.unitId
                                                            }
                                                        }).catch(function(err) {
                                                                res.json({
                                                                    status: "error",
                                                                    response: error_handler.GetCommonError(err)
                                                                });
                                                            });
                                                        res.json({
                                                            status: "success",
                                                            response: "User & vehicle created successfully."
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
                                                    response: "User created successfully but Error while creating Property."
                                                });
                                            }
                                        });


                                    // })
                                    // .catch(function(err) {
                                    //     res.json({
                                    //         status: "error",
                                    //         response: error_handler.GetCommonError(err)
                                    //     });
                                    // });
                               


                           
                        } else {
                            res.json({
                                status: "error",
                                response: "Error while creating user & property."
                            });
                        }
                    });
                }
                else{
                    res.json({
                        status: "error",
                        response: "Licence plate Number already exits"
                    });
                }
            }
        });
};




exports.signupAsResident = function(req, res, next) {
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
                [Op.or]: [{ email: req.body.email }, { userName: req.body.userName }]
            }
        })
        .then(user => {
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

                            let mailInfo = ctr_mailer.mailerMethod(
                                {
                                    "actionCase":"userRegistrationResident",
                                    "to":req.body.email,
                                    "content":
                                    {
                                        "username":req.body.userName,
                                        "email":req.body.email,
                                        "password":req.body.password
                                    }
                                })


                            res.json({
                                status: "success",
                                response: "User created successfully."
                            });
                            // var newUserId = userSignup.get({ plain: true }).id;
                            // dbinstance.property
                            //     .create({
                            //         name: req.body.apartmentNumber,
                            //         propertyTypeId: default_propertyTypeId,
                            //         propertyAreaLocalityId: default_propertyAreaLocalityId,
                            //         vehicleCapacity: default_vehicle_capacity,
                            //         residentOwnerId: newUserId
                            //     })
                            //     .then(propertyCreate => {
                            //         if (propertyCreate) {
                            //             res.json({
                            //                 status: "success",
                            //                 response: "User & Property created successfully."
                            //             });
                            //         } else {
                            //             res.json({
                            //                 status: "error",
                            //                 response: "User created successfully but Error while creating Property."
                            //             });
                            //         }
                            //     });
                        } else {
                            res.json({
                                status: "error",
                                response: "Error while creating user & property."
                            });
                        }
                    });
            }
        });
};





exports.AddMyGuestAsResident = async function(req, res, next) {
    var eligibleForAddGuestO = await isHosteligibleForAddGuestOrNot(req.body.hostUserId,req.body.fromDate,req.body.toDate);
    
    if(eligibleForAddGuestO.canDo){
    let user  = await dbinstance.user
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
                 userName: req.body.userName
            }
        })
       
            //console.log(user);
            if (user) {
                res.json({
                    status: "error",
                    response: "User already exist with same Username."
                });
            } else {
                let ageneraterandomemail = await generaterandomemail();
                var hashPassword = bcrypt.hashSync(ageneraterandomemail, salt);
                
                dbinstance.user
                    .create({
                        userName: req.body.userName,
                        userRoleId: user_role_guest,
                        email: ageneraterandomemail,
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
                                    nationality: req.body.nationality,
                                    licencePlate: req.body.licencePlate,
                                    fromDate: req.body.fromDate,
                                    toDate: req.body.toDate
                                })
                                .then(guestCreate => {
                                    //console.log("guestCreate", guestCreate);
                                    if (guestCreate) {
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
        }else{
            
            res.json({
                status: "error",
                response: eligibleForAddGuestO.becauseOf
            });
        }
};

exports.getMyGuestsAsResident = function(req, res, next) {
    dbinstance.guest
        .findAll({
            include: [{
                model: dbinstance.user,
                attributes: []
            }],

            attributes: [
                ["id", "guestId"],
                ["userId", "guestUserId"],
                ["phone", "guestPhone"],
                ["dob", "guestDob"],
                ["nationality", "guestNationality"],
                ["isEnabled", "guestIsEnabled"],
                [Sequelize.col("user.id"), "guestUserId"],
                [Sequelize.col("user.userName"), "guestUserName"],
                [Sequelize.col("user.email"), "guestUserEmail"],
                "hostUserId",
                "createdAt",
                "licencePlate",
                "fromDate",
                "toDate"
            ],
            where: {
                hostUserId: req.body.hostUserId
            },
            raw: true
        })
        .then(vehicles => {
            if (vehicles === null) {
                res.json({ status: "error", response: "No vehicle Found." });
            } else {
                res.json({ status: "success", response: vehicles });
            }
        });
};

async function isHosteligibleForAddGuestOrNot(hostUserId,fromDate,toDate) {
    var afromDate = moment(fromDate);
    var btoDate = moment(toDate);
   

    let currentRequestforNumberOfDays = btoDate.diff(afromDate, 'days');
    let ComplexIdsInWhichHostAssoc  = await dbinstance.property
    .findOne({
        attributes: [
            "propertyAreaLocalityId"
        ],
        where: {
            residentOwnerId: hostUserId,
            isEnabled: 1
        },
        raw: true
    })
    
    let ComplexLimits = await getComplexLimits(ComplexIdsInWhichHostAssoc.propertyAreaLocalityId);
    let addedGuestsInPerod = await getResidentStatAboutGuest(hostUserId);
    let eligibleLimitOfGuestForsametime = await checkLimitOfGuestForsametime(hostUserId,fromDate,toDate);
    var canDo = false;
    var becauseOf = '';

if(eligibleLimitOfGuestForsametime >= ComplexLimits.lmtVstPmtMthlyAlwNumberAtOneTime){
    var canDo = false;
    var becauseOf = 'You can not add guest more than '+ComplexLimits.lmtVstPmtMthlyAlwNumberAtOneTime+' at same time.';
}else{
    if(addedGuestsInPerod.totalGuestsIncurrentMonth >= ComplexLimits.lmtVstPmtMthlyAlwNumber || addedGuestsInPerod.totalNumberOfDaysInThisMonth >= ComplexLimits.lmtVstPmtMthlyAlwDays){
        var canDo = false;
        if(addedGuestsInPerod.totalGuestsIncurrentMonth >= ComplexLimits.lmtVstPmtMthlyAlwNumber){
            becauseOf += 'Limit for add new guest exceeded for this month.';
        }
        if(addedGuestsInPerod.totalNumberOfDaysInThisMonth >= ComplexLimits.lmtVstPmtMthlyAlwDays){
            becauseOf += 'Limit of days for adding new guest is exceeded for this month.';
        }
    }else{
        var canDo = false;
        let AddedcurrentRequestforNumberOfDays = addedGuestsInPerod.totalNumberOfDaysInThisMonth+currentRequestforNumberOfDays
        if(AddedcurrentRequestforNumberOfDays >= ComplexLimits.lmtVstPmtMthlyAlwDays){

            becauseOf += 'Please select less number of days to be added because you have only '+(ComplexLimits.lmtVstPmtMthlyAlwDays-addedGuestsInPerod.totalNumberOfDaysInThisMonth)+' days left for this month.';
        }else{
            var canDo = true;
            var becauseOf = '';
        }
        
       
    }
}

  
    var resultSet=[];
    resultSet = { 
        canDo:canDo, 
        becauseOf:becauseOf
        };

        
    return resultSet;
 }

 async function getComplexLimits(propertyAreaLocalityId){
    let Complexlimits  = await dbinstance.propertyAreaLocality
    .findOne({
        attributes: [
            "lmtVstPmtMthlyAlwNumber",
            "lmtVstPmtMthlyAlwNumberAtOneTime",
            "lmtVstPmtMthlyAlwDays",
            "lmtTmpPmtMthlyAlwNumber",
            "lmtTmpPmtMthlyAlwDays"
        ],
        where: {
            id: propertyAreaLocalityId,
            isEnabled: 1
        },
        raw: true
    })
   
    return Complexlimits
 }

 async function getResidentStatAboutGuest(userId){

    const firstDay = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const lastDay   = moment().endOf('month').format('YYYY-MM-DD 00:00:00');

    let addedGuestsInPerod  = await dbinstance.guest
    .findAll({
        group: ['id'],
        attributes: [
                'id',
                'userId',
                'hostUserId',
                'fromDate',
                'toDate',
                [
                    Sequelize.fn('datediff', Sequelize.col('toDate'),Sequelize.col('fromDate')), 'total_test'
                ]
            ],
        where: {
            [Sequelize.Op.and]: 
            [
                {hostUserId: userId},
                {[Sequelize.Op.or]: [{fromDate:{[Sequelize.Op.between]: [firstDay, lastDay]}},{toDate: {[Sequelize.Op.between]: [firstDay, lastDay]}}]}
            ]    
        },
        raw: true
    })

    let totalGuestsIncurrentMonth = addedGuestsInPerod.length;
    let totalNumberOfDaysInThisMonth = await addedGuestsInPerod.reduce((total, obj) => obj.total_test + total,0)

    var resultSet=[];
    resultSet = { 
        totalGuestsIncurrentMonth:totalGuestsIncurrentMonth, 
        totalNumberOfDaysInThisMonth:totalNumberOfDaysInThisMonth
        };
    return resultSet;
 }


 async function checkLimitOfGuestForsametime(hostUserId,fromDate,toDate){
    const firstDay = moment(fromDate).format('YYYY-MM-DD 00:00:00');
    const lastDay   =  moment(toDate).format('YYYY-MM-DD 00:00:00');

    let countaddedGuestsInPerod  = await dbinstance.guest
    .count({
        // attributes: [
        //         'id',
        //         'userId',
        //         'hostUserId',
        //         'fromDate',
        //         'toDate',
        //         [
        //             Sequelize.fn('datediff', Sequelize.col('toDate'),Sequelize.col('fromDate')), 'total_test'
        //         ]
        //     ],
        where: {
            [Sequelize.Op.and]: 
            [
                {hostUserId: hostUserId},
                {
                    [Sequelize.Op.or]: 
                    [
                        {
                            fromDate:
                            {
                                [Sequelize.Op.between]: [firstDay, lastDay]
                            }
                        },
                        {
                            toDate: 
                            {
                                [Sequelize.Op.between]: [firstDay, lastDay]
                            }
                        }
                    ]  
                }
            ]    
        },
        raw: true
    })

    return countaddedGuestsInPerod;
 }