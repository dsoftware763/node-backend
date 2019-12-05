"use strict";

var error_handler = require("./error_handler.js");
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

exports.toggleIsEnabledStatus = function(req, res, next) {
    //console.log('Request Params-',req.body);
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    const isEnabled = req.body.isEnabled;
    

    if(tableName === 'parkingStaff' || tableName === 'resident' || tableName === 'guest' ){
        dbinstance[tableName]
        .findOne({
            attributes: [
                "userId",
               
            ],
            where:{ id: tableId }
            
        })
        .then(FindUser => {
        
            // console.log('ToggleChangeUser',FindUser.userId)
            dbinstance.user
                .update({ isEnabled: isEnabled }, {
                    where: {
                        id: FindUser.userId
                    }
                })
                .then(ToggleChangeUser => {


                }).catch(function(err) {
                    res.json({
                        status: "error",
                        response: error_handler.GetCommonError(err)
                    });
                });

        }).catch(function(err) {
            res.json({
                status: "error",
                response: error_handler.GetCommonError(err)
            });
        });
    }




    dbinstance[tableName]
    .update({ isEnabled: isEnabled }, {
        where: {
            id: tableId
        }
    })
    .then(ToggleChange => {
        if (ToggleChange[0]) {
            res.json({
                status: "success",
                response: capitalize(tableName)+" updated successfully."
            });
        } else {
            res.json({
                status: "error",
                response: "An unknown error occured while updating "+capitalize(tableName)
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




exports.toggleIsDeleted = function(req, res, next) {
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    const isDeleted = req.body.isDeleted;

    dbinstance[tableName]
        .update({ isDeleted: isDeleted }, {
            where: {
                id: tableId
            }
        })
        .then(ToggleChange => {
            if (ToggleChange[0]) {
                res.json({
                    status: "success",
                    response: capitalize(tableName)+" deleted successfully."
                });
            } else {
                res.json({
                    status: "error",
                    response: "An unknown error occured while deleting "+capitalize(tableName)
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




exports.updateResidentUserBasicDetails = function(req, res, next) {
    //console.log('req.bodyreq.bodyreq.bodyreq.body',req.body);
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    const phone = req.body.phone;
    const nationality = req.body.nationality;

    const temporaryPermitAllowed = req.body.temporaryPermitAllowed;
    const temporaryVehicleCanLast = req.body.temporaryVehicleCanLast;
    const visitorPermitAllowed = req.body.visitorPermitAllowed;
    const visitorVehicleCanStay = req.body.visitorVehicleCanStay;

    dbinstance[tableName]
        .update(
        { 
            phone: phone,
            nationality:nationality, 
            temporaryPermitAllowed: temporaryPermitAllowed,
            temporaryVehicleCanLast: temporaryVehicleCanLast,
            visitorPermitAllowed: visitorPermitAllowed,
            visitorVehicleCanStay: visitorVehicleCanStay 
        }, {
            where: {
                id: tableId
            }
        })
        .then(ToggleChange => {
            if (ToggleChange[0]) {
                res.json({
                    status: "success",
                    response: capitalize(tableName)+" updated successfully."
                });
            } else {
                res.json({
                    status: "error",
                    response: "An unknown error occured while updating "+capitalize(tableName)
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


exports.updateUserBasicDetails = async function(req, res, next) {
    
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    const phone = req.body.phone;
    const nationality = req.body.nationality;

    const email = req.body.email;
    const userName = req.body.userName;

    var ResultString = [];

    let FindUserSpcRoleTable = await dbinstance[tableName].findByPk(tableId,{raw: true})
    if(FindUserSpcRoleTable){
        if(phone !== FindUserSpcRoleTable.phone)
        {
            let updateUserSpcRoleTable = await dbinstance[tableName].update(
                { 
                    phone: phone,
                    // nationality:nationality
                }, {
                    where: {
                        id: tableId
                    }
                })

                if(updateUserSpcRoleTable){
                    ResultString.push('Phone')
                }
            
            }
        let FindUserTable = await dbinstance.user.findByPk(FindUserSpcRoleTable.userId,{raw: true})

        if(email !== FindUserTable.email || userName !== FindUserTable.userName){
           
            let UpdateUserTable = await dbinstance.user.update(
                { 
                    email: email,
                    userName: userName
                }, {
                    where: {
                        id: FindUserSpcRoleTable.userId
                    }
                })

                if(UpdateUserTable){
                    if(email !== FindUserTable.email){
                        ResultString.push('Email')
                    }
                    if(userName !== FindUserTable.userName){
                        ResultString.push('Username')
                    }
                    
                }
        }
         var response = {};
         var respStr = "";
        if(Object.keys(ResultString).length > 0){
            
            var resResp = ResultString.map(async vall => {
                if(respStr === ''){
                    respStr = vall
                }else{
                    respStr = respStr+','+vall
                }
               
            })
            response = {
                status: "success",
                response: respStr+' Updated Successfully.'
            }
        }else{
             response = {
                status: "error",
                response: "Nothing updated"
            }
           
        }

        res.json(response);
            
    }else{
        res.json({
            status: "error",
            response: "An unknown error occured while updating "+capitalize(tableName)
        });
    }
    // console.log('FindUserSpcRoleTable',FindUserSpcRoleTable);

    
  


    // let updateUserSpcRoleTable = await dbinstance[tableName]
    //     .update(
    //     { 
    //         phone: phone,
    //         nationality:nationality
    //     }, {
    //         where: {
    //             id: tableId
    //         }
    //     })

    //     console.log('updateUserSpcRoleTable',updateUserSpcRoleTable);
        // .then(ToggleChange => {
        //     if (ToggleChange[0]) {
        //         res.json({
        //             status: "success",
        //             response: capitalize(tableName)+" updated successfully."
        //         });
        //     } else {
        //         res.json({
        //             status: "error",
        //             response: "An unknown error occured while updating "+capitalize(tableName)
        //         });
        //     }
        // })
        // .catch(function(err) {
        //     res.json({
        //         status: "error",
        //         response: error_handler.GetCommonError(err)
        //     });
        // });
};




exports.GetResidentBasicDetails = function(req, res, next) {
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    dbinstance[tableName]
    .findOne({
        attributes: [
            "phone",
            "nationality",
            "temporaryPermitAllowed","temporaryVehicleCanLast","visitorPermitAllowed","visitorVehicleCanStay"
        ],
        where:{ id: tableId }
        
    })
    .then(user => {
        //console.log(user);
        if (user === null) {
            res.json({ status: "error", response: "No user Found." });
        } else {
            res.json({ status: "success", response: user });
        }
    })
    .catch(function(err) {
        res.json({
            status: "error",
            response: error_handler.GetCommonError(err)
        });
    });
}

exports.GetUserBasicDetails = function(req, res, next) {
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    dbinstance[tableName]
    .findOne({
        include: [{
            model: dbinstance.user,
            attributes: []
        }],
        attributes: [
            "phone",
            "nationality",
            [Sequelize.col("user.userName"), "userName"],
            [Sequelize.col("user.email"), "email"]
        ],
        where:{ id: tableId }
        
    })
    .then(user => {
        //console.log(user);
        if (user === null) {
            res.json({ status: "error", response: "No user Found." });
        } else {
            res.json({ status: "success", response: user });
        }
    })
    .catch(function(err) {
        res.json({
            status: "error",
            response: error_handler.GetCommonError(err)
        });
    });
}





exports.GetAllMyProperty = function(req, res, next) {
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
        where: {"residentOwnerId":req.body.userId},
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



exports.addProperty = function(req, res, next) {
    dbinstance.property
        .create(req.body)
        .then(ifaddProperty => {
            if (ifaddProperty) {
                res.json({
                    status: "success",
                    response: "Property created successfully."
                });
            } else {
                res.json({
                    status: "error",
                    response: "Error while creating property."
                });
            }
        }).catch(function(err) {
            res.json({
                status: "error",
                response: error_handler.GetCommonError(err)
            });
        });
}



exports.advsearch = async function(req, res, next) {
    
/*
Payload :
{
	"user":{
		"userRoleId":"",
		"userName": "",
		"email":"",
		"isEnabled":""
	},
	"searchUser":true,
	"userLimit":1,
	"userOffset":1,
	"property":{
		"name":"",
		"propertyTypeId":"",
		"propertyPermitId":"",
		"vehicleCapacity":"",
		"residentOwnerId":"",
		"isEnabled":""
	},
	"searchProperty":true,
	"propertyLimit":10,
	"propertyOffset":10,
	"vehicle":{
		"vehicleOptMakeId":"",
		"vehicleOptModelId":"",
		"vehicleOptYear":"",
		"vehicleOptColor":"",
		"vehicleOptChastype":"",
		"ownerUsersId":"",
		"licencePlateNumber":"",
		"isEnabled":""
	},
	"searchVehicle":true,
	"vehicleLimit":10,
	"vehicleOffset":10
}

*/
    let result_resp = {};
    let result = {};
    var response_user = 'success';
    var response_prop = 'success';
    var response_vehi = 'success';
   
    if(req.body.searchUser === true){
        let resultUser = await advsearchUserNew(req, res, next);
        if(resultUser.status === 'success'){
            result_resp = {
                ...result_resp,
                users: resultUser.response.user
            }
        }else{
            result_resp = {
                ...result_resp,
                users: []
            }
            response_user = resultUser.status;
        }
    }

    if(req.body.searchProperty === true){
        let resultProperty = await advsearchPropertyNew(req, res, next);
        if(resultProperty.status === 'success'){
            result_resp = {
                ...result_resp,
                properties: resultProperty.response.property
            }
        }else{
            result_resp = {
                ...result_resp,
                properties: []
            }
            response_prop = resultProperty.status;
        }
    }

    if(req.body.searchVehicle === true){
        let resultVehicle = await advsearchVehicleNew(req, res, next);
        if(resultVehicle.status === 'success'){
            result_resp = {
                ...result_resp,
                vehicles: resultVehicle.response.vehicle
            }
        }else{
            result_resp = {
                ...result_resp,
                vehicles: []
            }
            response_vehi = resultVehicle.status;
        }
    }


    if(response_user === 'success' && response_prop === 'success' && response_vehi === 'success'){
        result = {
            ...result,
            response: result_resp,
            status: "success"
        }
    }else{
        result = {
            ...result,
            response: "No result found due to error in query",
            status: "error"
        }
    }
    
    res.json(result);
}

async function advsearchUserNew(req, res, next){
    try {
        const UserCriteria = req.body.user;
        const UserCondsArray = [];
            
        var resultSet=[];
        Object.keys(UserCriteria).map(function(currentValue, index, arr){
            if(UserCriteria[currentValue] !== ''){
                UserCondsArray.push({[currentValue]: {[Sequelize.Op.like]: '%'+UserCriteria[currentValue]+'%'}}, );
            }
        });
    
    
        let users = await dbinstance.user.findAndCountAll({   
            offset:req.body.userPageSize*req.body.userPage,
            limit :req.body.userPageSize,
            where:
            {
                [Sequelize.Op.and]:UserCondsArray
            },
        })
        if(users) {
            resultSet = { 
                status: "success", response: { 
                        user:users,
                        userFound:users.length
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

async function advsearchPropertyNew(req, res, next){
    try {
        const PropertyCriteria = req.body.property;
        const PropertyCondsArray = [];
        const propertyOffset = req.body.propertyOffset;
        const propertyLimit = req.body.propertyLimit;
        var resultSet=[];
        Object.keys(PropertyCriteria).map(function(currentValue, index, arr){
            if(PropertyCriteria[currentValue] !== ''){
                PropertyCondsArray.push({[currentValue]: {[Sequelize.Op.like]: '%'+PropertyCriteria[currentValue]+'%'}}, );
            }
        });

   

        let properties = await dbinstance.property.findAndCountAll(
            {
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
                    "PropertyPermitId",
                    [Sequelize.col("PropertyPermitId.name"), "propertyPermitName"],
                    ["vehicleCapacity", "propertyVehicleCapicity"],
                    ["residentOwnerId", "propertyResidentOwnerId"],
                    ["isEnabled", "propertyIsEnabled"],
                    [Sequelize.col("UserId.userName"), "propertyOwnerUserName"],
                    [Sequelize.col("UserId.email"), "propertyOwnerUserEmail"]
                ],
                raw: true,
                offset:req.body.propertyPageSize*req.body.propertyPage,
                limit :req.body.propertyPageSize,
                where:{[Sequelize.Op.and]:PropertyCondsArray}
            }
        )
    
    
        if(properties) {
            resultSet = { 
                status: "success", response: { 
                        property:properties,
                        propertyFound:properties.length
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

async function advsearchVehicleNew(req, res, next) {
    try{
        const VehicleCriteria = req.body.vehicle;
        const VehicleCondsArray = [];
        const vehicleOffset = req.body.vehicleOffset;
        const vehicleLimit = req.body.vehicleLimit;
        var resultSet=[];
        Object.keys(VehicleCriteria).map(function(currentValue, index, arr){
            if(VehicleCriteria[currentValue] !== ''){
                VehicleCondsArray.push({[currentValue]: {[Sequelize.Op.like]: '%'+VehicleCriteria[currentValue]+'%'}}, );
            }
        });
       
       
                let vehicles = await dbinstance.vehicle.findAndCountAll(
                    {
                        include: [{
                                model: dbinstance.vehicleOptMake,
                                attributes: []
                            },
                            {
                                model: dbinstance.vehicleOptModel,
                                attributes: []
                            },
                            {
                                model: dbinstance.user,
                                as: "UserId",
                                attributes: [],
                                include: [{
                                    model: dbinstance.userRole,
                                    attributes: []
                                }]
                            }
                        ],
            
                        attributes: [
                            ["id", "vehicleId"],
                            "vehicleOptMakeId", [Sequelize.col("vehicleOptMake.name"), "vehicleOptMakename"],
                            "vehicleOptModelId", [Sequelize.col("vehicleOptModel.name"), "vehicleOptModelname"],
                            "vehicleOptColor",
                            "vehicleOptYear",
                            "licencePlateNumber",
                            "vehicleOptChastype",
                            "vehicleOptWheeltype", [Sequelize.col("ownerUsersId"), "vehicleOwnerUsersId"],
                            [Sequelize.col("UserId.userName"), "vehicleOwnerUsersName"],
                            [Sequelize.col("UserId.email"), "vehicleOwnerEmail"],
                            [Sequelize.col("UserId->userRole.userType"), "vehicleOwnerRoleType"],
                            [Sequelize.col("UserId->userRole.id"), "vehicleOwnerRoleId"],
                            [Sequelize.col("UserId->userRole.name"), "vehicleOwnerRoleName"],
                            "isEnabled"
                        ],
                        where: {[Sequelize.Op.and]:VehicleCondsArray},
                        offset:req.body.vehiclePageSize*req.body.vehiclePage,
                        limit :req.body.vehiclePageSize,
                        raw: true
                    }
                )



        if(vehicles) {
            resultSet = { 
                status: "success", response: { 
                        vehicle:vehicles,
                        vehicleFound:vehicles.length
                    }
                };
            return resultSet;
        }
    }catch(err){
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }



}




exports.GetCountries = function(req, res, next) {
    dbinstance.optCountry
        .findAll({
            where: {
            'isEnabled': 1
        }, 
        order: [
            ['countryName', 'ASC'],
        ],
        raw: true
    })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No country Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.GetStates = function(req, res, next) {
    dbinstance.optState
        .findAll({
                where: {
                'countryID': req.body.countryID
            }, 
            order: [
                ['stateName', 'ASC'],
            ], 
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No State Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.GetCities = function(req, res, next) {
    dbinstance.optCity
        .findAll({
                where: {
                'stateID': req.body.stateID
            }, 
            order: [
                ['cityName', 'ASC'],
            ], 
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No City Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.GetCities = function(req, res, next) {
    dbinstance.optCity
        .findAll({
                where: {
                'stateID': req.body.stateID
            }, 
            order: [
                ['cityName', 'ASC'],
            ], 
            raw: true
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No City Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};


exports.updateProperty = function(req, res, next) {
    const {residentOwnerId, id, units, propertyAreaLocalityId, vehicleCapacity, spacesList, 
        // visitorStayLengthInDays, noOfVisitorVehiclesAtTime, noOfvisitorVehicleAllowedInAMonth,
        name} = req.body
    try {
        dbinstance.property.findByPk(id)
            .then(property => {
                const wherObj = (property.residentOwnerId == residentOwnerId) ? { userId: residentOwnerId, propertyId: id } : { userId: residentOwnerId, propertyId: id, vehicleId: null }
                property.update({ residentOwnerId: residentOwnerId, vehicleCapacity: vehicleCapacity, 
                    // visitorStayLengthInDays: visitorStayLengthInDays, noOfVisitorVehiclesAtTime: noOfVisitorVehiclesAtTime, noOfvisitorVehicleAllowedInAMonth: noOfvisitorVehicleAllowedInAMonth,
                    name:name })
                .then(resultset => {
                    if (resultset === null) {
                        res.json({ status: "error", response: "No City Found." });
                    } else {
                        dbinstance.propertyUnitSpace.update({ userId : null,  propertyId: null},{ where: { propertyAreaLocalityId: propertyAreaLocalityId , propertyId: id}})
                        .then(resultset => {
                            units.map(aa => {
                                const vehicleIdd = (spacesList[aa] && spacesList[aa].vehicleId != "") ? spacesList[aa].vehicleId : null
                                dbinstance.propertyUnitSpace
                                .update({userId: residentOwnerId, propertyId: id, vehicleId: vehicleIdd} , {
                                    where: {
                                        id: aa
                                    }
                                })
                            })
                            res.json({ 
                                status: "success",
                                response: "Property updated successfully."
                            });
                        })
                    }
                });
            })
        } catch(err) {
            //console.log("err", err)
            res.json({status: "error", response: err})
        }
};


exports.getProperty = function(req, res, next) {
    dbinstance.property
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
};

exports.getAllPropertyUnitSpaces = async function(req, res, next) {
    const all_unitSpaces = dbinstance.propertyUnitSpace
        .findAll({
                include: [
                {
                    model: dbinstance.propertyPermit,
                    as: 'PropertyPermitId',
                    attributes: ["name"]
                }
            ],
            where: {propertyAreaLocalityId: req.body.propertyAreaLocalityId,
                [Op.or]: [{propertyId: req.body.propertyId}, {propertyId: null}]
                }, raw:true
        })
    const propertUnitSpaces = await dbinstance.propertyUnitSpace
            .findAll({
                where: {propertyId: req.body.propertyId, propertyAreaLocalityId: req.body.propertyAreaLocalityId},
                include: [
                    {
                        model: dbinstance.propertyPermit,
                        as: 'PropertyPermitId',
                        attributes: ["name"]
                    }
                ]
            })
    res.json({ 
        status: "success",
        allUnitSpaces: all_unitSpaces,
        propertyUnitSpaces: propertUnitSpaces
    });
};

exports.getUserVehicles = function(req, res, next) {
    dbinstance.vehicle
        .findAll({
            where: {
                ownerUsersId: req.body.data.userId
            }
        }).then(resultSet => {
            res.json({ 
                status: "success",
                userVehiclesList: resultSet
            });
        })
    };












exports.renameSingle = async function(req, res, next) {
   // console.log('req.body',req.body);
    const tableName = req.body.tableName;
    const tableId = req.body.tableId;
    const columnValue = req.body.columnValue;
    let findEntry = await dbinstance[tableName].findByPk(tableId,{raw: true})
    if(findEntry){
        let UpdateEntry = await dbinstance[tableName].update({name: columnValue},{where: {id: tableId}})
        if(UpdateEntry){
            res.json({
                status: "success",
                response: capitalize(tableName)+" Updated Successfully"
            });
        }else{
            res.json({
                status: "error",
                response: "An unknown error occured while update id ("+tableId+") for Table "+capitalize(tableName)
            });   
        }       
    }else{
        res.json({
            status: "error",
            response: "Invalid id ("+tableId+") for Table "+capitalize(tableName)
        });
    }
};



exports.renameBulk = async function(req, res, next) {
    //console.clear();
    const tableName = req.body.tableName;
    const tableData = req.body.tableData;
    let UpdateBulkEntry = await dbinstance[tableName].bulkCreate(
        tableData,
        {
          updateOnDuplicate: ["name"],
          ignoreDuplicates: true,
        //individualHooks: false,
        //raw:true
        }
      )

      if(UpdateBulkEntry){
        res.json({
            status: "success",
            response: capitalize(tableName)+" Updated Successfully"
        });
      }else{
        res.json({
            status: "error",
            response: "Error while update Table "+capitalize(tableName)
        });
      }
};