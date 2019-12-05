"use strict";
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
var error_handler = require("./error_handler.js");

exports.GetAllConstants = async function(req, res, next) {
    const constants = await dbinstance.constant
        .findAll({
            raw: true
        })
        if(constants !== null){
            res.json({ status: "success", response: constants });
        }else{
            res.json({ status: "error", response: "No constant Found." });
        }
};

exports.updateSingleConstant = async function(req, res, next) {
    const constants = await dbinstance.constant
        .findAll({
            raw: true
        })
        if(constants !== null){
            res.json({ status: "success", response: constants });
        }else{
            res.json({ status: "error", response: "No constant Found." });
        }
};