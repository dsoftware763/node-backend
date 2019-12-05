"use strict";

var error_handler = require("./error_handler.js");
var dbinstance = require("../models/index");
// var Op = require('sequelize').Op;
var Sequelize = require("sequelize");

exports.getMyVehiclesAsResident = function(req, res, next) {
    dbinstance.vehicle
        .findAll({
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
            where: {
                [Sequelize.Op.or]: [{ ownerUsersId: req.body.user_id }]
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

exports.toggleIsEnabledVehicleAsResident = function(req, res, next) {
    dbinstance.vehicle
        .update({ isEnabled: req.body.isEnabled }, {
            where: {
                id: req.body.vehicleId,
                ownerUsersId: req.body.userId
            }
        })
        .then(ToggleVehicle => {
            ////console.log(ToggleVehicle);
            if (ToggleVehicle[0]) {
                res.json({
                    status: "success",
                    response: "Vehicle updated successfully."
                });
            } else {
                res.json({
                    status: "error",
                    response: "An unknown error occured while updating vehicle."
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

exports.getmyvehicleSingleAsResident = function(req, res, next) {

        const CondsArray = [];
            //  [
            //     { ownerUsersId: req.body.userId },
            //     { id: req.body.vehicleId }
            // ]
        
            if(typeof req.body.userId != 'undefined'){
                CondsArray.push({ownerUsersId:req.body.userId} );
            }
            if(req.body.vehicleId !== ''){
                CondsArray.push({id:req.body.vehicleId} );
            }


    dbinstance.vehicle
        .findOne({
            include: [{
                    model: dbinstance.vehicleOptMake,
                    attributes: []
                },
                {
                    model: dbinstance.vehicleOptModel,
                    attributes: []
                },
                {
                    model: dbinstance.optState,
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
                "countryID",
                "optStateId", [Sequelize.col("optState.stateName"), "optStateName"],
                "vehicleOptChastype",
                "vehicleOptWheeltype", [Sequelize.col("ownerUsersId"), "vehicleOwnerUsersId"],
                [Sequelize.col("UserId.userName"), "vehicleOwnerUsersName"],
                [Sequelize.col("UserId.email"), "vehicleOwnerEmail"],
                [Sequelize.col("UserId->userRole.userType"), "vehicleOwnerRoleType"],
                [Sequelize.col("UserId->userRole.id"), "vehicleOwnerRoleId"],
                [Sequelize.col("UserId->userRole.name"), "vehicleOwnerRoleName"],
                "isEnabled"
            ],
            where: {
                [Sequelize.Op.and]:CondsArray
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

exports.AddMyVehiclesAsResident = function(req, res, next) {
    dbinstance.vehicle
        .create({
            ownerUsersId: req.body.user_id,
            vehicleOptMakeId: req.body.carMake,
            vehicleOptModelId: req.body.carModel,
            vehicleOptColor: req.body.carColour,
            vehicleOptYear: req.body.carYear,
            licencePlateNumber: req.body.carLicencePlateNum,
            vehicleOptChastype: req.body.carChassiType,
            vehicleOptWheeltype: req.body.carWheelType,
            optStateId: req.body.vehicleState,
            countryID: 'USA'
        })
        .then(vehicleAdd => {
            res.json({ status: "success", response: "Vehicle added successfully." });
        })
        .catch(function(err) {
            res.json({
                status: "error",
                response: error_handler.GetCommonError(err)
            });
        });
};

exports.UpdateMyVehiclesAsResident = function(req, res, next) {
    dbinstance.vehicle
        .update({
            vehicleOptMakeId: req.body.carMake,
            vehicleOptModelId: req.body.carModel,
            vehicleOptColor: req.body.carColour,
            vehicleOptYear: req.body.carYear,
            licencePlateNumber: req.body.carLicencePlateNum,
            vehicleOptChastype: req.body.carChassiType,
            vehicleOptWheeltype: req.body.carWheelType,
            optStateId: req.body.carLicencePlateState
        }, {
            where: {
                id: req.body.vehicleId
                    // ownerUsersId: req.body.userId
            }
        })
        .then(vehicleUpdate => {
            if (vehicleUpdate[0]) {
                res.json({
                    status: "success",
                    response: "Vehicle updated successfully."
                });
            } else {
                res.json({
                    status: "error",
                    response: "An unknown error occured while updating vehicle."
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



exports.GetAllVehiclesForCommon = async function(req, res, next) {
    const {rowsPerPage, page} = req.body
    const offset = page*rowsPerPage
    const vehicleTotalCount = await dbinstance.vehicle.count()
    dbinstance.vehicle
        .findAll({
            offset: Number(offset),
            limit: Number(rowsPerPage),
            include: [{
                    model: dbinstance.vehicleOptMake,
                    attributes: []
                },
                {
                    model: dbinstance.vehicleOptModel,
                    attributes: []
                },
                {
                    model: dbinstance.optState,
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
                "countryID",
                "optStateId", [Sequelize.col("optState.stateName"), "optStateName"],
                "vehicleOptWheeltype", [Sequelize.col("ownerUsersId"), "vehicleOwnerUsersId"],
                [Sequelize.col("UserId.userName"), "vehicleOwnerUsersName"],
                [Sequelize.col("UserId.email"), "vehicleOwnerEmail"],
                [Sequelize.col("UserId->userRole.userType"), "vehicleOwnerRoleType"],
                [Sequelize.col("UserId->userRole.id"), "vehicleOwnerRoleId"],
                [Sequelize.col("UserId->userRole.name"), "vehicleOwnerRoleName"],
                "isEnabled"
            ],
            raw: true
        })
        .then(vehicles => {
            if (vehicles === null) {
                res.json({ status: "error", response: "No vehicle Found." });
            } else {
                const promises = vehicles.map(async vehicle => {
                    
                    const propertyUnitSpace = await dbinstance.propertyUnitSpace.findOne({where:{vehicleId: vehicle.vehicleId}})
                    const permitId = propertyUnitSpace ? propertyUnitSpace.propertyPermitId : ""
                    let permitName = "RESIDENT_PARKING_PERMIT"
                    if (permitId){
                        const result = await dbinstance.propertyPermit
                        .findOne({
                            where:{id: permitId},
                            attributes: [
                                ["name", "permitName"]
                            ],
                            raw: true
                        })
                        if (result){
                            permitName = result.permitName
                        }
                    }
                    vehicle.permitName = permitName
                    return vehicle
                })
                Promise.all(promises).then(function(results) {
                    res.json({ status: "success", response: results, vehicleTotalCount: vehicleTotalCount });
                })
                
                // res.json({ status: "success", response: vehicles, vehicleTotalCount: vehicleTotalCount });
            }
        });
};



exports.CreateNewVehicleOption = async function(req, res, next) {
   
    let response = await CreateNewVehicleOptionMethod(req.body.make,req.body.model);
    res.json(response);
       
};

async function CreateNewVehicleOptionMethod(make,model){
    try {
        let ChkModelResult = await dbinstance.vehicleOptModel
        .findOne({where: {
            name:model
        }, raw: true})

        if(ChkModelResult === null){
            let MakeResult = await dbinstance.vehicleOptMake
            .findOrCreate({where: {
                name:make
            }, defaults: {isEnabled: 1,isDeleted: 0}, raw: true})
                
            let IsNewRecordMake = MakeResult[1];
            if(IsNewRecordMake){
                var MakeResultId = MakeResult[0].get({ plain: true }).id;
            }else{
                var MakeResultId = MakeResult[0].id;
            }
            
            

            let ModelResult = await dbinstance.vehicleOptModel
            .findOrCreate({where: {
                name:model,
                vehicleOptMakeId:MakeResultId
            }, defaults: {isEnabled: 1,isDeleted: 0}, raw: true})
                
            let IsNewRecordModel = ModelResult[1];
            if(IsNewRecordModel){
                var ModelResultId = ModelResult[0].get({ plain: true }).id;
            }else{
                var ModelResultId = ModelResult[0].id;
            }
            
            var resultSet=[];
            resultSet = {
                status: "success",
                response: {"make":MakeResultId,"model":ModelResultId,"isMakeNewEntry":IsNewRecordMake,"isModelNewEntry":IsNewRecordModel}
            };
        
            return resultSet;
        }else{
            var resultSet=[];
            resultSet = {
                status: "error",
                response: "Vehicle Model already exist."
            };
        
            return resultSet;
        }

        
        
       
        
     } catch(err) {    var resultSet=[];
        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err)
        };
        return resultSet;
    }
}

exports.getAllVehicleOptMake = function(req, res, next) {
    dbinstance.vehicleOptMake
        .findAll({
            order: [
                ['name', 'ASC']
            ],
        })
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No make Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.getAllvehicleOptModel = function(req, res, next) {
    dbinstance.vehicleOptModel
        .findAll(
                {
                    where: 
                    {
                        vehicleOptMakeId: req.body.MakeId,
                        // vehicleOptMakeId: 7
                    }
                }
            )
        .then(resultset => {
            if (resultset === null) {
                res.json({ status: "error", response: "No model Found." });
            } else {
                res.json({ status: "success", response: resultset });
            }
        });
};

exports.fetchVehiclesWithUserId = function(req, res, next) {
    dbinstance.vehicle
        .findAll({where: {ownerUsersId: req.body.id}})
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

exports.GetAllVehiclesUnderAStaff = async function(req, res, next) {
    const {rowsPerPage, page, userId} = req.body
    const MyLocalityIds = await getPropertylocalityIdsOfParkingStaff(userId);
    //console.log('MyLocalityIds----',MyLocalityIds);
    var VehicleIds = [];
    var count = '';
    if(MyLocalityIds.status === 'success'){
        const VehiclesThatAreAssociateWithSpacesUnderMyLocality = await getVehicleIdsUnderMyParkings(MyLocalityIds.response, rowsPerPage, page);
        if(VehiclesThatAreAssociateWithSpacesUnderMyLocality.status === 'success'){
            VehicleIds = VehiclesThatAreAssociateWithSpacesUnderMyLocality.response;
            count = VehiclesThatAreAssociateWithSpacesUnderMyLocality.count;
        }
    }
    res.json({ status: "success",vehicleTotalCount: count, response: VehicleIds});
   
};

async function getVehicleIdsUnderMyParkings(propertyLocalityIds,rowsPerPage, page){
   
    try{
        const offset = page*rowsPerPage
        const count = await dbinstance.propertyUnitSpace.count({
            where: {
               propertyAreaLocalityId: {
                   [Sequelize.Op.or]: propertyLocalityIds
                 },
               isEnabled: 1,
               vehicleId: {[Sequelize.Op.ne]: null}
            }
        })
        const Vehicles = await dbinstance.propertyUnitSpace.findAll({
            offset: Number(offset),
            limit: Number(rowsPerPage),
             where: {
                propertyAreaLocalityId: {
                    [Sequelize.Op.or]: propertyLocalityIds
                  },
                isEnabled: 1,
                vehicleId: {[Sequelize.Op.ne]: null}
             },
            
            include: [                
                {
                    model: dbinstance.vehicle,
                    // as: 'Vehicle',
                    // attributes: []
                    include: [                        
                        {
                            model: dbinstance.vehicleOptModel
                        },
                        {
                            model: dbinstance.vehicleOptMake
                        },
                        {
                            model: dbinstance.user,
                            as: 'UserId',
                            include: [
                                {
                                    model: dbinstance.userRole
                                }
                            ]
                        },
                        {
                            model: dbinstance.optState
                        }
                    ]
                },
                {
                    model: dbinstance.propertyAreaLocality,
                    as: 'PropertyAreaLocalityId',
                    // attributes: []
                    include: [
                        {
                            model: dbinstance.optState,
                            as: 'States'
                        }
                    ]
                },
                {
                    model: dbinstance.property,
                    as: 'PropertyId'
                },
                {
                    model: dbinstance.propertyPermit,
                    as: 'PropertyPermitId'
                }
            ],

            attributes: [
                'vehicleId',
                ['name','SpaceName']
                // [Sequelize.col("PropertyAreaLocalityId.name"), "PropertyName"],
            ],
             raw: true
         })
         
        //  const vehicleIds = Vehicles.map(aa => {return (aa.vehicleId)})
 
         var resultSet=[];
         resultSet = { 
             status: "success", 
             response: Vehicles,
             count: count
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


async function getPropertylocalityIdsOfParkingStaff(parkingStaffId){
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