"use strict";
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
var error_handler = require("./error_handler.js");

var ctr_mailer = require("./ctr_mailer.js");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
var salt = bcrypt.genSaltSync(saltRounds);
const user_role_superadmin = 1;
const user_role_admin = 2;
const user_role_parkingstaff = 3;
const user_role_resident = 4;
const user_role_guest = 5;
const user_role_manager = 6;


exports.test = async function(req, res, next) {
   
    // let myComplexIds = await Promise.all(req.body.userIdsArray.map(item => addStaffToProperty(req.body.propertyAreaLocalityId,item)))
    let myComplexIds = await isPropertyComplexAlreadySetup(2);
    res.json(myComplexIds);
       
};


async function getPropertyUnitsOfComplex(propertyAreaLocalityId){
    try{

        var resultSet=[];
        let Result = await dbinstance.property.findAll(
            {
                attributes: [
                // 'propertyAreaLocalityId',
                [Sequelize.fn('COUNT', Sequelize.col('propertyAreaLocalityId')), 'sumOfTotal'],
                // [Sequelize.fn('SUM', Sequelize.col('numberOfResereved')), 'sumOfResereved'],
                // [Sequelize.fn('SUM', Sequelize.col('numberOfGeneral')), 'sumOfGeneral'],
                // [Sequelize.fn('SUM', Sequelize.col('numberOfVisitorPermitAllowed')), 'sumOfVisitorPermitAllow'],
                // [Sequelize.fn('SUM', Sequelize.col('numberOfTemporaryPermitAllowed')), 'sumOfTemporaryPermitAllow'],
                ],
                group: 'propertyAreaLocalityId',
                raw: true,
                logging: true
            }
        )
        //console.log('Query Result', Result)

        return Result
    
    }
    catch(err){
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }

}


async function isPropertyComplexAlreadySetup(propertyAreaLocalityId){
    try{

        var resultSet=[];
        let Result = await dbinstance.propertyAreaLocality.findByPk(propertyAreaLocalityId,
            {
                attributes: ["isSetupByManager"],
                // raw: true
            }
        )
        //console.log('Query Result', Result.isSetupByManager)

        return Result.isSetupByManager
    
    }
    catch(err){
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }
}

async function CreatePropertyUnitsSpacesMethod(propertyAreaLocalityId,general,reserve,handycap){
    try {
       
        var values = [];
        var i;
        for (i = 1; i <= general; i++) { 
            values.push({
                propertyAreaLocalityId:propertyAreaLocalityId,
                propertyPermitId:1,
                isEnabled:1,
                createdAt: new Date()
            })
        }
        for (i = 1; i <= reserve; i++) { 
            values.push({
                propertyAreaLocalityId:propertyAreaLocalityId,
                propertyPermitId:2,
                isEnabled:1,
                createdAt: new Date()
            })
        }
        for (i = 1; i <= handycap; i++) { 
            values.push({
                propertyAreaLocalityId:propertyAreaLocalityId,
                propertyPermitId:5,
                isEnabled:1,
                createdAt: new Date()
            })
        }

        var resultSet=[];
        let Result = await dbinstance.propertyUnitSpace
        .bulkCreate( values )
        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: Result
            };
        return resultSet;
    } catch(err) {
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }   
}


async function CreatePropertyUnitsForComplexMethod(UnitCount,propertyAreaLocalityId){
    try {
        let count = UnitCount;
        var values = [];
        var i;
        for (i = 1; i <= count; i++) { 
            values.push({
                // name:'U-'+propertyAreaLocalityId+'-'+i,
                // name: "",
                propertyAreaLocalityId:propertyAreaLocalityId,
                isEnabled:1,
                createdAt: new Date()
            })
        }


        var resultSet=[];
        let Result = await dbinstance.property
        .bulkCreate( values )
        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: Result
            };
        return resultSet;
    } catch(err) {
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet
    }   
}




/**  **   ************************************************ */


exports.GetManagerOfProperty = async function(req, res, next) {
   
    let myComplexIds = await GetManagerOfProperties(req.body.propertyAreaLocalityId);
    res.json(myComplexIds);
       
};
async function GetManagerOfProperties(propertyAreaLocalityId){
    try {
       
        var resultSet=[];
        let MyLocalityIds = await dbinstance.propertyStaff
        .findAll({
            where: {
                propertyAreaLocalityId: propertyAreaLocalityId,
                isEnabled: 1,
                isAssistant: 0
                },
                raw: true
        })
        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: MyLocalityIds
            };
        return resultSet;
        
    } catch(err) {
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}




exports.GetAssManagerOfProperty = async function(req, res, next) {
   
    let myComplexIds = await GetAssManagerOfProperties(req.body.propertyAreaLocalityId);
    res.json(myComplexIds);
       
};
async function GetAssManagerOfProperties(propertyAreaLocalityId){
    try {
       
        var resultSet=[];
        let MyLocalityIds = await dbinstance.propertyStaff
        .findAll({
                include: [{
                    model: dbinstance.user,
                    //as: 'UsersIds',
                    attributes: ['email','userName']
                }],
            where: {
                propertyAreaLocalityId: propertyAreaLocalityId,
                isEnabled: 1,
                isAssistant: 1
                },
                raw: true
        })
        var resultSet=[];
        resultSet = { 
            status: "success", 
            response: MyLocalityIds
            };
        return resultSet;
        
    } catch(err) {
        var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}

exports.UpdateManagerToProperty = async function(req, res, next) {
   
    let myComplexIds = await AssignManagerToProperty(req.body.propertyAreaLocalityId,req.body.userId);
    res.json(myComplexIds);
       
};


async function setStaffAsAssistant(propertyAreaLocalityId,userId){
    try {
        let MyLocalityIds = await dbinstance.propertyStaff
            .update({
                isAssistant:1,
                isEnabled:1
            },{
            where: {
                    userId:userId,
                    propertyAreaLocalityId:  propertyAreaLocalityId
                },
                raw: true
            })

            var resultSet=[];
            resultSet = {
                status: "success",
                response: MyLocalityIds
            };
            return resultSet; 
     } catch(err) {    
         var resultSet=[];
        resultSet = {
            status: "errors",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}

async function resetStaffofProperty(propertyAreaLocalityId){
    try {
        let MyLocalityIds = await dbinstance.propertyStaff
            .update({
                // isAssistant:null,
                isEnabled:0
            },{
            where: {
                    isAssistant:1,
                    propertyAreaLocalityId:  propertyAreaLocalityId
                },
                raw: true
            })

            var resultSet=[];
            resultSet = {
                status: "success",
                response: MyLocalityIds
            };
            return resultSet; 
     } catch(err) {    
         var resultSet=[];
        resultSet = {
            status: "errors",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}

async function resetManagerOfProperty(propertyAreaLocalityId){
    try {
        let MyLocalityIds = await dbinstance.propertyStaff
            .update({
                isEnabled:0
            },{
            where: {
                    isAssistant:0,
                    propertyAreaLocalityId:  propertyAreaLocalityId
                },
                raw: true
            })

            var resultSet=[];
            resultSet = {
                status: "success",
                response: MyLocalityIds
            };
            return resultSet; 
     } catch(err) {    
         var resultSet=[];
        resultSet = {
            status: "errors",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}



async function enableManagerOfProperty(propertyAreaLocalityId,userId){
    try {
        let MyLocalityIds = await dbinstance.propertyStaff
            .update({
                isEnabled:1
            },{
            where: {
                    isAssistant:0,
                    propertyAreaLocalityId:  propertyAreaLocalityId,
                    userId: userId
                },
                raw: true
            })

            var resultSet=[];
            resultSet = {
                status: "success",
                response: MyLocalityIds
            };
            return resultSet; 
     } catch(err) {    
         var resultSet=[];
        resultSet = {
            status: "errors",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}


async function createAndaddStaffToProperty(propertyAreaLocalityId,assParkingDetails){
// console.log('assParkingDetails',propertyAreaLocalityId,assParkingDetails);
try{
var result = [];

let user = await dbinstance.user
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
                    [Sequelize.Op.or]: [{ email: assParkingDetails.email }, { userName: assParkingDetails.userName }]
                }
            })
           
                console.log('useruseruser',user)
                if (user) {
                   //console.log('alreadyexituser',user);
                   await addStaffToProperty(propertyAreaLocalityId,user.id)
                    result.push({
                        status: "error",
                        response: assParkingDetails.email+"("+assParkingDetails.userName+")"+" User already exist with same Username or Email."
                    });
                    
                    return result;
                } else {
                   
                    var hashPassword = bcrypt.hashSync(assParkingDetails.password, salt);
                    let userSignup = await dbinstance.user
                        .create({
                            userName: assParkingDetails.userName,
                            userRoleId: 3,
                            email: assParkingDetails.email,
                            password: hashPassword
                        })
                       
                            
                            if (userSignup) {
                                var newUserId = userSignup.get({ plain: true }).id;
                                var SignUpRole = 'parkingStaff';
                                
                               
                                let UserInRoleTBLCreate = dbinstance[SignUpRole]
                                    .create({
                                        userId: newUserId
                                    })
                                   

                                        let mailInfo = ctr_mailer.mailerMethod(
                                            {
                                                "actionCase":"userRegistrationParkingStaff",
                                                "to":assParkingDetails.email,
                                                "content":
                                                {
                                                    "username":assParkingDetails.userName,
                                                    "email":assParkingDetails.email,
                                                    "password":assParkingDetails.password
                                                }
                                            })
                                    
                                        if (UserInRoleTBLCreate) {
                                            await addStaffToProperty(propertyAreaLocalityId,newUserId)
                                            result.push({
                                                status: "success",
                                                response: SignUpRole+" created successfully."
                                            });
                                            return result;
                                        } else {
                                            result.push({
                                                status: "error",
                                                response: "User created successfully but Error while creating "+SignUpRole+"."
                                            });
                                            return result;
                                        }
                                  
                            } else {
                                result.push({
                                    status: "error",
                                    response: "Error while creating User & "+SignUpRole+"."
                                });
                                return result;
                            }
                      
                }
         
           
           
}catch(err){
    return err;
}
           
}

async function addStaffToProperty(propertyAreaLocalityId,userId){
    try {
        let MyLocalityNewIds = await dbinstance.propertyStaff
        .findOrCreate({where: {
            propertyAreaLocalityId:propertyAreaLocalityId,
            userId:userId,
            isAssistant:  {
                [Sequelize.Op.in]: [0,1]
            },
        }, defaults: {isAssistant: 1,isEnabled: 1}})
            
            // if(!MyLocalityNewIds[1]){
                 let setStaffAsAssistantaaa = await setStaffAsAssistant(propertyAreaLocalityId,userId);
            // }
            var resultSet=[];
            resultSet = {
                status: "success",
                // response: MyLocalityNewIds[0],
            };
            return resultSet;
       
        
     } catch(err) {    var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}

async function AssignManagerToProperty(propertyAreaLocalityId,userId){
    try {
        let resetManagerOfProperties = await resetManagerOfProperty(propertyAreaLocalityId)
        
        let MyLocalityNewIds = await dbinstance.propertyStaff
        .findOrCreate({where: {
            propertyAreaLocalityId:propertyAreaLocalityId,
            userId:userId,
            isAssistant: 0,
        }, defaults: {isAssistant: 0,isEnabled: 1}, raw: true})
            
        let enablesManagerOfProperties = await enableManagerOfProperty(propertyAreaLocalityId,userId)

        var resultSet=[];
        resultSet = {
            status: "success",
            response: MyLocalityNewIds[0]
        };
        resultSet.response['newEntry']=MyLocalityNewIds[1]
        return resultSet;
       
        
     } catch(err) {    var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}


async function GetAllMyPropCompIdsInArray(userId){
    try {
       
        var resultSet=[];
        let MyLocalityIds = await dbinstance.propertyStaff
        .findAll({
            attributes: ['propertyAreaLocalityId'],
            where: {
                    userId: userId,
                    isEnabled: 1
                },
                raw: true
        })
        if(MyLocalityIds) {

            const MyLocalityIdsArray = [];
            Object.keys(MyLocalityIds).map(function(currentValue, index, arr){
                if(MyLocalityIds[currentValue] !== ''){
                    MyLocalityIdsArray.push(MyLocalityIds[index]['propertyAreaLocalityId']);
                }
            });

            resultSet = { 
                status: "success", 
                response: { 
                        ids:MyLocalityIdsArray
                    }
                };
            return resultSet;
        }
        
    } catch(err) {
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
  
}

exports.GetAllMySpaces = async function(req, res, next){
    const {rowsPerPage, page} = req.body
    const offset = Number(page)*Number(rowsPerPage)
   
    let whereCondition = {};
   
    if(req.body.userId !== ''){
        let myComplexIds = await GetAllMyPropCompIdsInArray(req.body.userId);
        if(myComplexIds.status == 'success'){
            whereCondition = {
                ...whereCondition,
                propertyAreaLocalityId: {[Sequelize.Op.in]:myComplexIds.response.ids}
            }
        }
    }


    
    if(req.body.propertyAreaLocalityId !== ''){
            whereCondition = {
                ...whereCondition,
                propertyAreaLocalityId:req.body.propertyAreaLocalityId
            }
    }

    
    if(req.body.unitSpaceId !== ''){
        whereCondition = {
            ...whereCondition,
            propertyId:req.body.unitSpaceId
        }
    }
    const spacesTotalCount = await dbinstance.propertyUnitSpace.count({where: whereCondition})
    dbinstance.propertyUnitSpace
    .findAll(
        {
            offset: Number(offset),
            limit: Number(rowsPerPage),
            attributes: [
                ["id","PropertySpace_Id"],
                ["name", "PropertySpace_name"],
                ["propertyAreaLocalityId","PropertySpace_propertyAreaLocalityId"],
                
                // [Sequelize.col("PropertyAreaLocalityId.id"), "PropertySpace_TblPropertyAreaLocalityId_Id"],
                [Sequelize.col("PropertyAreaLocalityId.name"), "PropertySpace_TblPropertyAreaLocalityId_name"],
                [Sequelize.col("PropertyAreaLocalityId.latitude"), "PropertySpace_TblPropertyAreaLocalityId_latitude"],
                [Sequelize.col("PropertyAreaLocalityId.longitude"), "PropertySpace_TblPropertyAreaLocalityId_longitude"],
                [Sequelize.col("PropertyAreaLocalityId->City.cityName"), "PropertySpace_TblPropertyAreaLocalityId_cityName"],
                [Sequelize.col("PropertyAreaLocalityId->States.stateName"), "PropertySpace_TblPropertyAreaLocalityId_stateName"],
                [Sequelize.col("PropertyAreaLocalityId.zip"), "PropertySpace_TblPropertyAreaLocalityId_zip"],
                [Sequelize.col("PropertyAreaLocalityId->Countrys.countryName"), "PropertySpace_TblPropertyAreaLocalityId_countryName"],
                
                ["propertyId","PropertySpacePropertyUnit_Id"],
                [Sequelize.col("PropertyId.id"), "PropertySpace_TblPropertyUnit_Id"],
                [Sequelize.col("PropertyId.propertyTypeId"), "PropertySpace_TblPropertyUnit_PropertyTypeId"],
                [Sequelize.col("PropertyId.propertyPermitId"), "PropertySpace_TblPropertyUnit_PropertyPermitId"],

                
                [Sequelize.col("PropertyPermitId.name"), "PropertySpace_TblPropertyUnit_TblPropertyPermit_Name"],

                
                [Sequelize.col("PropertyId.propertyAreaLocalityId"), "PropertySpace_TblPropertyUnit_PropertyAreaLocalityId"],
                
                [Sequelize.col("PropertyId.name"), "PropertySpace_TblPropertyUnit_name"],
                [Sequelize.col("PropertyId.numberOfResereved"), "PropertySpace_TblPropertyUnit_PropertyUnit_NumberOfResereved"],
                [Sequelize.col("PropertyId.numberOfGeneral"), "PropertySpace_TblPropertyUnit_PropertyUnit_NumberOfGeneral"],
                [Sequelize.col("PropertyId.numberOfVisitorPermitAllowed"), "PropertySpace_TblPropertyUnit_PropertyUnit_NumberOfVisitorPermitAllowed"],
                [Sequelize.col("PropertyId.daysPerMonthAllowedForGuest"), "PropertySpace_TblPropertyUnit_PropertyUnit_DaysPerMonthAllowedForGuest"],
                [Sequelize.col("PropertyId.numberOfTemporaryPermitAllowed"), "PropertySpace_TblPropertyUnit_PropertyUnit_NumberOfTemporaryPermitAllowed"],
                [Sequelize.col("PropertyId.daysForTemporaryPermitAllowed"), "PropertySpace_TblPropertyUnit_PropertyUnit_DaysForTemporaryPermitAllowed"],
                [Sequelize.col("PropertyId.residentOwnerId"), "PropertySpace_TblPropertyUnit_PropertyUnit_ResidentOwnerId"],


                // ["propertyPermitId","PropertySpacePermitId"],
                ["userId","PropertySpaceOwnerId"],
                ["vehicleId","PropertySpaceVehicleId"],
                ["forHandicap","PropertySpaceForHandicap"],
                ["isEnabled","PropertySpaceIsEnabled"],
                ["isDeleted","PropertySpaceIsDeleted"],
                ["createdAt","PropertySpaceCreatedAt"],
                ["updatedAt","PropertySpaceUpdatedAt"],
                // [Sequelize.col("UserId.id"), "PropertiesSpaceOwnerId"],
                // [Sequelize.col("propertyAreaLocality.name"), "palName"],
                // [Sequelize.col("propertyAreaLocality.latitude"), "palLatitude"],
                // [Sequelize.col("propertyAreaLocality.longitude"), "palLongitude"],
                // [Sequelize.col("propertyAreaLocality.zip"), "palZip"],
                // // [Sequelize.col("propertyAreaLocality->Countrys.countryID"), "parkingStaffEmail"],
                // [Sequelize.col("propertyAreaLocality->Countrys.countryName"), "palCountryName"],
                // // [Sequelize.col("propertyAreaLocality->States.stateID"), "parkingStaffEmail"],
                // [Sequelize.col("propertyAreaLocality->States.stateName"), "palStateName"],
                // // [Sequelize.col("propertyAreaLocality->City.cityID"), "parkingStaffEmail"],
                // [Sequelize.col("propertyAreaLocality->City.cityName"), "palCityName"],
                // "isAssistant"
            ],
            include: [
                {   model: dbinstance.propertyAreaLocality,
                    as: "PropertyAreaLocalityId",
                    attributes: [
                        // ['id',"PropertyAreaLocalityId"],
                        // ['name',"PropertyAreaLocalityName"],
                        // ['latitude',"PropertyAreaLocalityLatitude"],
                        // ['longitude',"PropertyAreaLocalityLongitude"],
                        // ['zip',"PropertyAreaLocalityZip"]
                    ],
            
                    include: [
                        {
                                model: dbinstance.optCountry,
                                as: "Countrys",
                                attributes: ['countryName'],
                                // attributes: [],
                            },
                            {
                                model: dbinstance.optState,
                                as: "States",
                                attributes: ['stateName'],
                                // attributes: [],
                            },
                            {
                                model: dbinstance.optCity,
                                as: "City",
                                attributes: ['cityName'],
                                // attributes: [],
                            },
                        ]
                },
                {   model: dbinstance.property,
                    as: "PropertyId",
                    attributes: [
                        // 'name',
                        // 'propertyTypeId',
                        // 'propertyPermitId',
                        // 'propertyAreaLocalityId',
                        // 'propertyAreaLocalityId',
                        // 'numberOfResereved',
                        // 'numberOfGeneral',
                        // 'numberOfVisitorPermitAllowed',
                        // 'daysPerMonthAllowedForGuest',
                        // 'numberOfTemporaryPermitAllowed',
                        // 'daysForTemporaryPermitAllowed',
                        // 'residentOwnerId'
                    ]
                },
                {   model: dbinstance.propertyPermit,
                    as: "PropertyPermitId",
                    attributes: [
                        // ['name',"PropertyPermitName"]
                    ] 
                },
                {   model: dbinstance.user,
                    as: "UserId",
                    attributes: [
                        ['id',"SpaceOwnerId"],
                        ['userRoleId',"SpaceOwnerRoleId"],
                        ['userName',"SpaceOwnerUserName"],
                        ['email',"SpaceOwnerEmail"]
                    ],
                    include: [
                        {
                            model: dbinstance.userRole,
                            as: "userRole",
                            attributes: [
                                ['userType',"SpaceOwnerUserRoleType"],
                                ['name',"SpaceOwnerUserRoleTypeName"]
                            ],
                        }]
                }
        ],
        order: [
            ['id', 'ASC']
        ],
        where: whereCondition,
        raw: true
        }
    )
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No spaces Found." });
        } else {
            res.json({ status: "success", response: resultset, spacesTotalCount: spacesTotalCount });
        }
    });
}


exports.getMySinglePropertyComplex = function(req, res, next){
    const id = req.body.propertyAreaLocalityId
    dbinstance.propertyAreaLocality
    .findByPk(id,{
        raw: true
      }).then(async resultset => {
           
        if (resultset === null) {
            res.json({ status: "error", response: "No property complex Found." });
        } else {
            let UnitCount = await dbinstance.property.count({where: {propertyAreaLocalityId: id}})
            let count = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: id}})
            let generalCount = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: id, propertyPermitId: 1}})
            let reservedCount = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: id, propertyPermitId: 2}})
            let handicapCount = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: id, propertyPermitId: 5}})
            resultset.numberOfUnits = UnitCount 
            resultset.numberOfSpacesTotal = count
            resultset.numberOfSpacesHandicap = handicapCount
            resultset.numberOfSpacesReserved = reservedCount
            resultset.numberOfSpacesGeneral =  generalCount
            res.json({ status: "success", response: resultset });
        }
    });
}

exports.updateMySinglePropertyComplex = async function(req, res, next){
    let isAlreadySetup = await isPropertyComplexAlreadySetup(req.body.id);
    dbinstance.propertyAreaLocality
        .update({
            name:req.body.name,
            numberOfUnits:req.body.numberOfUnits,
            // numberOfSpacesTotal:req.body.numberOfSpacesTotal,
            // numberOfSpacesHandicap:req.body.numberOfSpacesHandicap,
            // numberOfSpacesReserved:req.body.numberOfSpacesReserved,
            // numberOfSpacesGeneral:req.body.numberOfSpacesGeneral,

            lmtVstPmtMthlyAlwNumber:req.body.lmtVstPmtMthlyAlwNumber,
            lmtVstPmtMthlyAlwNumberAtOneTime:req.body.lmtVstPmtMthlyAlwNumberAtOneTime,
            lmtVstPmtMthlyAlwDays:req.body.lmtVstPmtMthlyAlwDays,
            lmtTmpPmtMthlyAlwNumber:req.body.lmtTmpPmtMthlyAlwNumber,
            lmtTmpPmtMthlyAlwDays:req.body.lmtTmpPmtMthlyAlwDays,

            isSetupByManager:req.body.isSetupByManager
        }, {
            where: {
                id: req.body.id
                    // ownerUsersId: req.body.userId
            }
        })
        .then(async PropertyComplex => {
            
            if(!isAlreadySetup){
                let CreatePropertyUnitsSpacesMethods = await CreatePropertyUnitsSpacesMethod(req.body.id,req.body.numberOfSpacesGeneral,req.body.numberOfSpacesReserved,req.body.numberOfSpacesHandicap)
                let CreatePropertyUnitsForComplexMethods = await CreatePropertyUnitsForComplexMethod(req.body.numberOfUnits,req.body.id)
            }
            let resetStaffofProperties = await resetStaffofProperty(req.body.id)

            let myComplexIds = await Promise.all(req.body.newassistantManagers.map(async item => {
              return await createAndaddStaffToProperty(req.body.id,item)
             
            }
            ))
            // console.log('myComplexIdsmyComplexIdsmyComplexIds',myComplexIds)
            // myComplexIds.map(itemm=>console.log('myComplexIds',itemm))

            if (PropertyComplex[0]) {
                res.json({
                    status: "success",
                    response: "Property Complex updated successfully."
                });
            } else {
                res.json({
                    status: "error",
                    response: "An unknown error occured while updating Property Complex."
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


// Original
// exports.updateMySinglePropertyComplex = async function(req, res, next){
//     let isAlreadySetup = await isPropertyComplexAlreadySetup(req.body.id);
//     dbinstance.propertyAreaLocality
//         .update({
//             numberOfUnits:req.body.numberOfUnits,
//             // numberOfSpacesTotal:req.body.numberOfSpacesTotal,
//             // numberOfSpacesHandicap:req.body.numberOfSpacesHandicap,
//             // numberOfSpacesReserved:req.body.numberOfSpacesReserved,
//             // numberOfSpacesGeneral:req.body.numberOfSpacesGeneral,
//             isSetupByManager:req.body.isSetupByManager
//         }, {
//             where: {
//                 id: req.body.id
//                     // ownerUsersId: req.body.userId
//             }
//         })
//         .then(async PropertyComplex => {
            
//             if(!isAlreadySetup){
//                 let CreatePropertyUnitsSpacesMethods = await CreatePropertyUnitsSpacesMethod(req.body.id,req.body.numberOfSpacesGeneral,req.body.numberOfSpacesReserved,req.body.numberOfSpacesHandicap)
//                 let CreatePropertyUnitsForComplexMethods = await CreatePropertyUnitsForComplexMethod(req.body.numberOfUnits,req.body.id)
//             }
//             let resetStaffofProperties = await resetStaffofProperty(req.body.id,req.body.assistantManagers)
//             let myComplexIds = await Promise.all(req.body.assistantManagers.map(item => addStaffToProperty(req.body.id,item)))
//             if (PropertyComplex[0]) {
//                 res.json({
//                     status: "success",
//                     response: "Property Complex updated successfully."
//                 });
//             } else {
//                 res.json({
//                     status: "error",
//                     response: "An unknown error occured while updating Property Complex."
//                 });
//             }
//         })
//         .catch(function(err) {
//             res.json({
//                 status: "error",
//                 response: error_handler.GetCommonError(err)
//             });
//         });
// }

exports.getAllMyPropertiesComplex = async function(req, res, next){
    const {rowsPerPage, page, userId} = req.body 
    const offset = Number(page)*Number(rowsPerPage)

    const staffs = await dbinstance.propertyStaff.findAll({
        where: {
            userId: userId
        },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
    const complexTotalCount = await dbinstance.propertyAreaLocality.count({where: { id: propertyAreaLocalityIds}})

    dbinstance.propertyStaff
    .findAll(
        {
            offset: Number(offset),
            limit: Number(rowsPerPage),
            include: [{
                model: dbinstance.propertyAreaLocality,
                // attributes: ['id','name','latitude','longitude','zip'],
                attributes: [],
                where: {
                    // userId: req.body.userId,
                    isEnabled: 1
                },
                include: [{
                            model: dbinstance.optCountry,
                            as: "Countrys",
                            // attributes: ['countryName'],
                            attributes: [],
                        },
                        {
                            model: dbinstance.optState,
                            as: "States",
                            // attributes: ['stateName'],
                            attributes: [],
                        },
                        {
                            model: dbinstance.optCity,
                            as: "City",
                            // attributes: ['cityName'],
                            attributes: [],
                        },
                    ]
            }
        ],
        attributes: [
            [Sequelize.col("propertyAreaLocality.id"), "palId"],
            [Sequelize.col("propertyAreaLocality.name"), "palName"],
            [Sequelize.col("propertyAreaLocality.latitude"), "palLatitude"],
            [Sequelize.col("propertyAreaLocality.longitude"), "palLongitude"],
            [Sequelize.col("propertyAreaLocality.zip"), "palZip"],
            // [Sequelize.col("propertyAreaLocality->Countrys.countryID"), "parkingStaffEmail"],
            [Sequelize.col("propertyAreaLocality->Countrys.countryName"), "palCountryName"],
            // [Sequelize.col("propertyAreaLocality->States.stateID"), "parkingStaffEmail"],
            [Sequelize.col("propertyAreaLocality->States.stateName"), "palStateName"],
            // [Sequelize.col("propertyAreaLocality->City.cityID"), "parkingStaffEmail"],
            [Sequelize.col("propertyAreaLocality->City.cityName"), "palCityName"],
            "isAssistant",
            [Sequelize.col("propertyAreaLocality.isSetupByManager"), "isSetupByManager"],
            [Sequelize.col("propertyAreaLocality.numberOfUnits"), "numberOfUnits"],
            [Sequelize.col("propertyAreaLocality.numberOfSpacesTotal"), "numberOfSpacesTotal"],
            [Sequelize.col("propertyAreaLocality.numberOfSpacesHandicap"), "numberOfSpacesHandicap"],
            [Sequelize.col("propertyAreaLocality.numberOfSpacesReserved"), "numberOfSpacesReserved"],
            [Sequelize.col("propertyAreaLocality.numberOfSpacesGeneral"), "numberOfSpacesGeneral"],
        ],
        where: {
            userId: req.body.userId,
            isEnabled: 1
        },
            raw: true
        }
    )
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property complex Found." });
        } else {
            var promises =  resultset.map(async aa => {
       
                let UnitCount = await dbinstance.property.count({where: {propertyAreaLocalityId: aa.palId}})
                let count = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: aa.palId}})
                let generalCount = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: aa.palId, propertyPermitId: 1}})
                let reservedCount = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: aa.palId, propertyPermitId: 2}})
                let handicapCount = await dbinstance.propertyUnitSpace.count({where: {propertyAreaLocalityId: aa.palId, propertyPermitId: 5}})
                //console.log("$$$$$$", aa.palId)
                    var obj = aa;
                    obj.numberOfUnits = UnitCount
                    obj.numberOfSpacesTotal = count 
                    obj.numberOfSpacesGeneral = generalCount
                    obj.numberOfSpacesReserved = reservedCount
                    obj.numberOfSpacesHandicap = handicapCount
                    return obj
            })
            Promise.all(promises).then(function(results) {
                res.json({ status: "success", response: results, complexTotalCount: complexTotalCount });
            })
        }
    });
}

exports.GetAllPropertyComplexes = async function(req, res, next){
    // dbinstance.propertyAreaLocality
    // .findAll()
    // .then(resultset => {
    //     if (resultset === null) {
    //         res.json({ status: "error", response: "No property complex Found." });
    //     } else {
    //         res.json({ status: "success", response: resultset });
    //     }
    // });

    const staffs = await dbinstance.propertyStaff.findAll({
        where: {
            userId: req.body.userId
        },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
 
    dbinstance.propertyAreaLocality.findAll(
        {where: {
            id: propertyAreaLocalityIds,
            isEnabled:1
    }})
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property Found." });
        } else {
            res.json({ status: "success", response: resultset});
        }
    });
}

exports.GetAllProperties = async function(req, res, next){
    const staffs = await dbinstance.propertyStaff.findAll({
        where: {
            userId: req.body.data.id
        },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
    console.log(propertyAreaLocalityIds,'propertyAreaLocalityIds')
    dbinstance.property.findAll(
        {where: {
            propertyAreaLocalityId: propertyAreaLocalityIds,
            residentOwnerId: null
    }})
    .then(resultset => {
        
        if (resultset === null) {
            res.json({ status: "error", response: "No property Found." });
        } else {
            res.json({ status: "success", response: resultset});
        }
    });
}

exports.AddNewUnitSpace = async function(req, res, next){
    const {rowsPerPage, rowsPerPageNow, propertyId,name} = req.body
    const shouldApendRow = (rowsPerPage > rowsPerPageNow) ? true : false 
    dbinstance.property.findByPk(propertyId)
    .then(unit => {
        dbinstance.propertyUnitSpace
        .create({propertyId: req.body.propertyId, propertyPermitId: req.body.propertyPermitId, propertyAreaLocalityId: unit.propertyAreaLocalityId, name: name})
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "Error while creating resident unit" });
            } else {
                dbinstance.propertyAreaLocality.findOne({
                    where:{id: unit.propertyAreaLocalityId}
                })
                .then(resultset2 => {
                    let obj = resultset.dataValues
                    obj.propertyAreaLocalityName = resultset2.name
                    obj.propertyName = unit.dataValues.name
                    obj.permitName = req.body.permitName
                    res.json({ status: "success", response: obj, shouldApendRow:  shouldApendRow});
                    //console.log("MMMMMM", obj, req.body)
                })
            }
        });
    }).catch(err => {
        //console.log("error")
    })
}

exports.AddNewResidentUnit = function(req, res, next){
    const {rowsPerPage, rowsPerPageNow, name} = req.body
    const shouldApendRow = (rowsPerPage > rowsPerPageNow) ? true : false 
    dbinstance.property
    .create({propertyAreaLocalityId: req.body.propertyAreaLocalityId, name: name})
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "Error while creating resident unit" });
        } else {
            dbinstance.propertyAreaLocality.findByPk(req.body.propertyAreaLocalityId)
            .then(resultset2 => {
                let obj = resultset.dataValues
                obj.propertyAreaLocalityName = resultset2.name
                res.json({ status: "success", response: obj, shouldApendRow:  shouldApendRow});
            })
        }
    });
}

exports.GetAllPropertyComplexAsAdmin = async function(req, res, next){
    const {rowsPerPage, page} = req.body
    const offset = page*rowsPerPage
    const allAdminComplexTotalCount = await dbinstance.propertyAreaLocality.count()
    dbinstance.propertyAreaLocality
    .findAll(
        {
            offset: Number(offset),
            limit: Number(rowsPerPage),
            group: 'id',
            include: [{
                model: dbinstance.optCity,
                as: "City",
                attributes: ["cityName"]
            },
            // {
            //     model: dbinstance.optCountry,
            //     as: "Countrys",
            // attributes: ["countryName"]
            // },
            {
                model: dbinstance.optState,
                as: "States",
                attributes: ["stateName"]
            },
            {
                model: dbinstance.propertyStaff,
               as: "propertyStaffs",
                attributes: [],
                where: {
                    isEnabled: 1,
                    isAssistant: 0
                },
                include: [{
                    model: dbinstance.user,
                    as: "user",
                    attributes: [
                        "userName",
                        "email"
                    ]
                }]
            }
        ],
        attributes: [
            "id",
            "name",
            "latitude",
            "longitude",
            "countryID",
        //    [Sequelize.col("Countrys.countryName"), "countryName"],
            "stateID",
        //    [Sequelize.col("States.stateName"), "stateName"],
            "cityID",
        //   [Sequelize.col("City.cityName"), "cityName"],
            "zip",
          // [Sequelize.col("propertyStaffs.userId"), "parkingStaffId"],
        //   [Sequelize.col("propertyStaffs->user.userName"), "parkingStaffUserName"],
        //   [Sequelize.col("propertyStaffs->user.email"), "parkingStaffEmail"],
            "numberOfUnits",
            "numberOfSpacesTotal",
            "numberOfSpacesHandicap",
            "numberOfSpacesReserved",
            "numberOfSpacesGeneral",
            "isEnabled",
            "isDeleted",
            "isSetupByManager",
            "createdAt",
            "updatedAt",
        ],
            raw: true,
        }
    )
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property complex Found." });
        } else {
            resultset.map(aa => {
                var obj = aa;
                obj.cityName = aa["City.cityName"] 
                obj.stateName = aa["States.stateName"] 
                obj.parkingStaffUserName = aa["propertyStaffs.user.userName"] 
                obj.parkingStaffEmail = aa["propertyStaffs.user.email"] 
                return obj
            })
            res.json({ status: "success", response: resultset, allAdminComplexTotalCount: allAdminComplexTotalCount });
        }
    });
}
exports.GetAllPropertyAsAdmin = function(req, res, next) {
    dbinstance.property
    .findAll({
        offset: Number(offset),
        limit: Number(rowsPerPage),
        include: [{
            model: dbinstance.user,
            as: "UserId",
            attributes: []
        },
        {
            model: dbinstance.propertyType,
            as: 'PropertyTypeId',
            attributes: []
        },
        {
            model: dbinstance.propertyAreaLocality,
            as: 'PropertyAreaLocalityId',
            attributes: []
        }
    ],
        attributes: [
            ["id", "propertyId"],
            ["name", "propertyName"],
            "propertyTypeId", 
            [Sequelize.col("PropertyTypeId.name"), "propertyTypeName"],
            "propertyAreaLocalityId",
            [Sequelize.col("PropertyAreaLocalityId.name"), "propertyAreaLocalityName"],
            ["vehicleCapacity", "propertyVehicleCapicity"],
            ["residentOwnerId", "propertyResidentOwnerId"],
            ["isEnabled", "propertyIsEnabled"],
            [Sequelize.col("UserId.userName"), "propertyOwnerUserName"],
            [Sequelize.col("UserId.email"), "propertyOwnerUserEmail"]
        ],
        raw: true
    })
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property Found." });
        } else {
            res.json({ status: "success", response: resultset });
        }
    });
};


exports.GetAllPropertyAsManager = function(req, res, next) {
    dbinstance.property
    .findAll({
        include: [{
            model: dbinstance.user,
            as: "UserId",
            attributes: []
        },
        {
            model: dbinstance.propertyType,
            as: 'PropertyTypeId',
            attributes: []
        },
        {
            model: dbinstance.propertyAreaLocality,
            as: 'PropertyAreaLocalityId',
            attributes: []
        }
    ],
        attributes: [
            ["id", "propertyId"],
            ["name", "propertyName"],
            "propertyTypeId", 
            [Sequelize.col("PropertyTypeId.name"), "propertyTypeName"],
            "propertyAreaLocalityId",
            [Sequelize.col("PropertyAreaLocalityId.name"), "propertyAreaLocalityName"],
            ["vehicleCapacity", "propertyVehicleCapicity"],
            ["residentOwnerId", "propertyResidentOwnerId"],
            ["isEnabled", "propertyIsEnabled"],
            [Sequelize.col("UserId.userName"), "propertyOwnerUserName"],
            [Sequelize.col("UserId.email"), "propertyOwnerUserEmail"]
        ],
        raw: true
    })
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property Found." });
        } else {
            res.json({ status: "success", response: resultset });
        }
    });
};


exports.GetAllResidentUnits = async function(req, res, next) {
    const staffs = await dbinstance.propertyStaff.findAll({
        where: {
            userId: req.body.userId
        },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
 
    dbinstance.property.findAll(
        {where: {
            propertyAreaLocalityId: propertyAreaLocalityIds
    }})
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property Found." });
        } else {
            res.json({ status: "success", response: resultset});
        }
    });
}


exports.GetAllPropertyAsCommon = async function(req, res, next) {
    const {rowsPerPage, page} = req.body
    const offset = page*rowsPerPage
    const totalUnitsCount = await dbinstance.property.count()
    dbinstance.property
    .findAll({
        offset: Number(offset),
        limit: Number(rowsPerPage),
        include: [{
            model: dbinstance.user,
            as: "UserId",
            attributes: []
        },
        {
            model: dbinstance.propertyType,
            as: 'PropertyTypeId',
            attributes: []
        },
        {
            model: dbinstance.propertyAreaLocality,
            as: 'PropertyAreaLocalityId',
            attributes: []
        },
        {
            model: dbinstance.propertyPermit,
            as: 'PropertyPermitId',
            attributes: []
        }
    ],
        attributes: [
            ["id", "propertyId"],
            ["name", "propertyName"],
            "propertyTypeId", 
            [Sequelize.col("PropertyTypeId.name"), "propertyTypeName"],
            "propertyAreaLocalityId",
            [Sequelize.col("PropertyAreaLocalityId.name"), "propertyAreaLocalityName"],
            "propertyPermitId",
            [Sequelize.col("PropertyPermitId.name"), "propertyPermitName"],
            ["vehicleCapacity", "propertyVehicleCapicity"],
            ["residentOwnerId", "propertyResidentOwnerId"],
            ["isEnabled", "propertyIsEnabled"],
            [Sequelize.col("UserId.userName"), "propertyOwnerUserName"],
            [Sequelize.col("UserId.email"), "propertyOwnerUserEmail"]
        ],
        raw: true
    })
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property Found." });
        } else {
            res.json({ status: "success", response: resultset, totalUnitsCount: totalUnitsCount });
        }
    });
};


exports.GetAllPropertyTypes = function(req, res, next) {
    dbinstance.propertyType
        .findAll()
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.GetAllPropertyPermits = function(req, res, next) {
    dbinstance.propertyPermit
        .findAll()
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No user Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.GetAllPermits = function(req, res, next) {
    dbinstance.propertyPermit
        .findAll({
            attributes: [
                ["id", "permitId"],
                ["name", "permitName"]
            ],
            raw: true
        })
        .then(ResultSet => {
            //console.log("ResultSet-GetAllPermits-", ResultSet);
            if (ResultSet === null) {
                res.json({
                    status: "error",
                    response: "No Permit found."
                    
                });
            } else {
                res.json({
                    status: "success",
                    response: ResultSet
                });
            }
        })
        .catch(function(err) {
            res.json({
                status: "error",
                response: error_handler.GetCommonError(err)
            });
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

exports.AddPropertyComplex = function(req, res, next) {
    GetUserRoleIdByUserRole(req.body.userRole, function(err, UserRoleResult)  {
        if (err) {
           res.json({
                status: "error",
                response: error_handler.GetCommonError(err)
            });
        } else {
            // console.log('Start User Adding');
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
                // console.log('Userzzusre',user);
                //console.log(user);
                if (user) {
                    res.json({
                        status: "error",
                        response: req.body.userRole+" already exist with same Username or Email."
                    });
                } else {
                    // console.log('creating user');
                    var hashPassword = bcrypt.hashSync(req.body.password, salt);
                    dbinstance.user
                        .create({
                            userName: req.body.userName,
                            userRoleId: UserRoleResult.id,
                            email: req.body.email,
                            password: hashPassword
                        })
                        .then(userSignup => {
                            // console.log('userSignup',userSignup);
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
// console.log('UserInRoleTBLCreate',UserInRoleTBLCreate);
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
                                            // res.json({
                                            //     status: "success",
                                            //     response: SignUpRole+" created successfully."
                                            // });

                                                                                    
                                            dbinstance.propertyAreaLocality
                                            .create({
                                                name: req.body.name,
                                                latitude: req.body.latitude,
                                                longitude: req.body.longitude,
                                                countryID: req.body.countryID,
                                                stateID: req.body.stateID,
                                                cityID: req.body.cityID,
                                                zip: req.body.zip,
                                            })
                                            .then(propertyAreaLocalityCreate => {
                                                
                                                    if (propertyAreaLocalityCreate) {

                                                        let newpropertyAreaLocality = propertyAreaLocalityCreate.get({ plain: true }).id;

                                                        // create new parking staff 
                                                        dbinstance.propertyStaff.create({
                                                            userId: newUserId,
                                                            propertyAreaLocalityId: newpropertyAreaLocality,
                                                            isAssistant: 0,
                                                            isEnabled: 1,
                                                        }).then(propertystaffCreate => {
                                                            if(propertystaffCreate){
                                                                res.json({
                                                                    status: "success",
                                                                    response: "Created Property Complex and Assigned/Created manager successfull.",
                                                                    newpropertyAreaLocality: newpropertyAreaLocality
                                                                });
                                                            }else{
                                                                res.json({
                                                                    status: "error",
                                                                    response: "Property created but Error while Assigned manager successfull to property."
                                                                });
                                                            }
                                                        }).catch(function(err) {
                                                            res.json({
                                                                status: "error",
                                                                response: error_handler.GetCommonError(err)
                                                            });
                                                        });
                                                        
                                                        
                                                    } else {
                                                        res.json({
                                                            status: "error",
                                                            response: "Error while creating Property Complex and no Manager assigned."
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

exports.getUnitSpace = function(req, res, next) {
    dbinstance.propertyUnitSpace
        .findByPk(req.body.id)
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No Property Found." });
            } else {
                res.json({ 
                    status: "success",
                    response: resultset
                 });
            }
        });
}

exports.updateUnitSpace = function(req, res, next) {
    const { isEnabled, propertyPermitId, unitSpaceId, vehicleId, name} = req.body
    try {
        dbinstance.propertyUnitSpace
            .update({ name:name,isEnabled: isEnabled, propertyPermitId: propertyPermitId, vehicleId: vehicleId }, {
                where: {
                    id: unitSpaceId
                }
            })
            .then(resultset => {
                if (resultset === null) {
                    res.json({ status: "error", response: "No space Found." });
                } else {
                        res.json({ 
                            status: "success",
                            response: "Unit Space updated successfully."
                        });
                }
            });
        } catch(err) {
            //console.log("err", err)
            res.json({status: "error", response: err})
        }
};

exports.releaseUnitSpace = function(req, res, next) {
    //console.log("tttt", req.body)
    try {
        dbinstance.propertyUnitSpace
            .update({ propertyId: null, userId: null, vehicleId: null }, {
                where: {
                    id: req.body.id
                }
            })
            .then(resultset => {
                if (resultset === null) {
                    res.json({ status: "error", response: "No space Found." });
                } else {
                        res.json({ 
                            status: "success",
                            response: "Unit Space released successfully."
                        });
                }
            });
        } catch(err) {
            //console.log("err", err)
            res.json({status: "error", response: err})
        }
};


exports.GetAllPropertyForParicularUser = async function(req, res, next) {
    
    const {rowsPerPage, page, userId} = req.body 
    const offset = page*rowsPerPage

    const staffs = await dbinstance.propertyStaff.findAll({
        where: {
            userId: userId
        },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
    const totalUnitsCount = await dbinstance.property.count({where: { propertyAreaLocalityId: propertyAreaLocalityIds}})
    dbinstance.property.findAll({
        where: {
            propertyAreaLocalityId: propertyAreaLocalityIds
        },
        attributes: [
            ["id", "propertyId"],
            ["name", "propertyName"],
            "propertyTypeId", 
            "residentOwnerId",
            "propertyAreaLocalityId",
            ["isEnabled", "propertyIsEnabled"],
            ["vehicleCapacity","propertyVehicleCapicity"]
        ],
        raw:true,
        offset: Number(offset),
        limit: Number(rowsPerPage)
    })
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property complex Found." });
        } else {
            var promises =  resultset.map(async aa => {
                const obj = aa
                const propertyAreaLocalityName = await dbinstance.propertyAreaLocality.findByPk(aa.propertyAreaLocalityId)
                if(aa.residentOwnerId)
                {
                    const user = await dbinstance.user.findByPk(aa.residentOwnerId)
                    obj.propertyOwnerUserEmail = user.email
                    obj.propertyOwnerUserName = user.userName
                }
                else{
                    obj.propertyOwnerUserEmail = ""
                    obj.propertyOwnerUserName = ""
                }
                obj.propertyAreaLocalityName = propertyAreaLocalityName.name
                return obj
            })
            Promise.all(promises).then(function(results) {
                res.json({ status: "success", response: results, totalUnitsCount: totalUnitsCount });
            })
        }
    });
};

exports.GetAllPropertyForAdmin = async function(req, res, next) {
    
    const {rowsPerPage, page, userId} = req.body 
    const offset = page*rowsPerPage

    const staffs = await dbinstance.propertyStaff.findAll({
        // where: {
        //     userId: userId
        // },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
    const totalUnitsCount = await dbinstance.property.count({where: { propertyAreaLocalityId: propertyAreaLocalityIds}})
    dbinstance.property.findAll({
        where: {
            propertyAreaLocalityId: propertyAreaLocalityIds
        },
        attributes: [
            ["id", "propertyId"],
            ["name", "propertyName"],
            "propertyTypeId", 
            "residentOwnerId",
            "propertyAreaLocalityId",
            ["isEnabled", "propertyIsEnabled"],
            ["vehicleCapacity","propertyVehicleCapicity"]
        ],
        raw:true,
        offset: Number(offset),
        limit: Number(rowsPerPage)
    })
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property complex Found." });
        } else {
            var promises =  resultset.map(async aa => {
                const obj = aa
                const propertyAreaLocalityName = await dbinstance.propertyAreaLocality.findByPk(aa.propertyAreaLocalityId)
                if(aa.residentOwnerId)
                {
                    const user = await dbinstance.user.findByPk(aa.residentOwnerId)
                    obj.propertyOwnerUserEmail = user.email
                    obj.propertyOwnerUserName = user.userName
                }
                else{
                    obj.propertyOwnerUserEmail = ""
                    obj.propertyOwnerUserName = ""
                }
                obj.propertyAreaLocalityName = propertyAreaLocalityName.name
                return obj
            })
            Promise.all(promises).then(function(results) {
                res.json({ status: "success", response: results, totalUnitsCount: totalUnitsCount });
            })
        }
    });
};





exports.GetAllUnitsOfParticularPropertyForAdmin = async function(req, res, next) {
    
    const {rowsPerPage, page, userId, propertyAreaLocalityId} = req.body 
    const offset = page*rowsPerPage

    const staffs = await dbinstance.propertyStaff.findAll({
        where: {
            propertyAreaLocalityId: propertyAreaLocalityId
        },
        attributes: ['propertyAreaLocalityId'],
    })
    const propertyAreaLocalityIds = staffs.map(aa => {return (aa.propertyAreaLocalityId)})
    const totalUnitsCount = await dbinstance.property.count({where: { propertyAreaLocalityId: propertyAreaLocalityIds}})
    dbinstance.property.findAll({
        where: {
            propertyAreaLocalityId: propertyAreaLocalityIds
        },
        attributes: [
            ["id", "propertyId"],
            ["name", "propertyName"],
            "propertyTypeId", 
            "residentOwnerId",
            "propertyAreaLocalityId",
            ["isEnabled", "propertyIsEnabled"],
            ["vehicleCapacity","propertyVehicleCapicity"]
        ],
        raw:true,
        offset: Number(offset),
        limit: Number(rowsPerPage)
    })
    .then(resultset => {
        if (resultset === null) {
            res.json({ status: "error", response: "No property complex Found." });
        } else {
            var nameOfProperty = '';
            var promises =  resultset.map(async aa => {
                const obj = aa
                const propertyAreaLocalityName = await dbinstance.propertyAreaLocality.findByPk(aa.propertyAreaLocalityId)
                if(aa.residentOwnerId)
                {
                    const user = await dbinstance.user.findByPk(aa.residentOwnerId)
                    obj.propertyOwnerUserEmail = user.email
                    obj.propertyOwnerUserName = user.userName
                }
                else{
                    obj.propertyOwnerUserEmail = ""
                    obj.propertyOwnerUserName = ""
                }
                obj.propertyAreaLocalityName = propertyAreaLocalityName.name
                nameOfProperty = propertyAreaLocalityName.name;
                return obj
            })
            
            Promise.all(promises).then(function(results) {
                res.json({ status: "success", response: results, totalUnitsCount: totalUnitsCount, nameOfProperty:nameOfProperty});
            })
        }
    });
};





exports.GetAllSpacesOfParticularPropertyForAdmin = async function(req, res, next) {
    
    const {rowsPerPage, page, userId, propertyAreaLocalityId} = req.body 
    const offset = page*rowsPerPage
    var nameOfProperty = '';

    const propertyAreaLocalityName = await dbinstance.propertyAreaLocality.findAll({
        where: {
            id: propertyAreaLocalityId
        },
        attributes:['name'],
        raw:true
    })
    if(propertyAreaLocalityName[0] !== undefined){
        nameOfProperty = propertyAreaLocalityName[0].name
    }

    const SpacesUnderPropertyCount = await dbinstance.propertyUnitSpace.count({
        where: {
            propertyAreaLocalityId: propertyAreaLocalityId
        }
    })


    const SpacesUnderProperty = await dbinstance.propertyUnitSpace.findAll({
        where: {
            propertyAreaLocalityId: propertyAreaLocalityId
        },
        include: [
            {
                model: dbinstance.propertyAreaLocality,
                as: 'PropertyAreaLocalityId',
                attributes: ['name']
            },
            {
                model: dbinstance.property,
                as: 'PropertyId',
                attributes: ['name']
            },
            {
                model: dbinstance.propertyPermit,
                as: 'PropertyPermitId',
                attributes: ['name']
            },
            {
                model: dbinstance.user,
                as: 'UserId',
                attributes: ['userName','email']
            },
            {
                model: dbinstance.vehicle,
                attributes: ['licencePlateNumber','ownerUsersId'],
                include: [{
                    model: dbinstance.user,
                    as: 'UserId',
                    attributes: ['userName','email']
                }]
            }
        ],
        offset: Number(offset),
        limit: Number(rowsPerPage),
        raw:true
    })

    // console.log('SpacesUnderProperty--',SpacesUnderProperty);
    if (SpacesUnderProperty !== null) {
        res.json({ status: "success", totalSpacesCount: SpacesUnderPropertyCount, nameOfProperty:nameOfProperty, response: SpacesUnderProperty,});
    }else{
        res.json({ status: "error", response: [], totalSpacesCount: 0, nameOfProperty:nameOfProperty});
    }

};





exports.GetAllSpacesOfParticularUnitForAdmin = async function(req, res, next) {
    
    const {rowsPerPage, page, userId, propertyId} = req.body 
    const offset = page*rowsPerPage
    var nameOfProperty = '';

    const propertyName = await dbinstance.property.findAll({
        where: {
            id: propertyId
        },
        attributes:['name'],
        raw:true
    })
    if(propertyName[0] !== undefined){
        nameOfProperty = propertyName[0].name
    }

    const SpacesUnderPropertyCount = await dbinstance.propertyUnitSpace.count({
        where: {
            propertyId: propertyId
        }
    })


    const SpacesUnderProperty = await dbinstance.propertyUnitSpace.findAll({
        where: {
            propertyId: propertyId
        },
        include: [
            {
                model: dbinstance.propertyAreaLocality,
                as: 'PropertyAreaLocalityId',
                attributes: ['name']
            },
            {
                model: dbinstance.property,
                as: 'PropertyId',
                attributes: ['name']
            },
            {
                model: dbinstance.propertyPermit,
                as: 'PropertyPermitId',
                attributes: ['name']
            },
            {
                model: dbinstance.user,
                as: 'UserId',
                attributes: ['userName','email']
            },
            {
                model: dbinstance.vehicle,
                attributes: ['licencePlateNumber','ownerUsersId'],
                include: [{
                    model: dbinstance.user,
                    as: 'UserId',
                    attributes: ['userName','email']
                }]
            }
        ],
        offset: Number(offset),
        limit: Number(rowsPerPage),
        raw:true
    })

    // console.log('SpacesUnderProperty--',SpacesUnderProperty);
    if (SpacesUnderProperty !== null) {
        res.json({ status: "success", totalSpacesCount: SpacesUnderPropertyCount, nameOfProperty:nameOfProperty, response: SpacesUnderProperty,});
    }else{
        res.json({ status: "error", response: [], totalSpacesCount: 0, nameOfProperty:nameOfProperty});
    }

};