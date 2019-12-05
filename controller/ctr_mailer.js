'use strict';
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
var dbinstance = require("../models/index");
var Sequelize = require("sequelize");
var fs = require("fs");
require('dotenv').config();
var error_handler = require("./error_handler.js");



exports.testmailerApi = async function(req, res, next) {
    // console.log(req.body);
    // {
    // 	"actionCase":"userRegistrationParkingStaff",
    // 	"to":"prabhjot.s.kbihm.com@gmail.com",
    // 	"content":{
    //  		"username":"Alan",
    //  		"password":"admin@123#"
    // 	}
    // }

    var reqbodyactionCase = "userRegistrationParkingStaff";
    var reqbodyto = "prabhjot.s.kbihm.com@gmail.com";
    var reqbodycontent = {
        "email":reqbodyto,
         		"username":"Alan",
         		"password":"admin@123#"
        	};
    
    switch (reqbodyactionCase) {
        case "userRegistrationParkingStaff":
            return await userRegisterationEmailParkingStaff(reqbodyto,reqbodycontent);
            break;

        case "userRegistrationResident":
            return await userRegisterationEmailResident(reqbodyto,reqbodycontent);
            break;

        default:
            return await sendMail(reqbodyto,reqbodyactionCase,JSON.stringify(reqbodycontent),JSON.stringify(reqbodycontent));
            break;
    }
  
};
exports.mailerApi = async function(req, res, next) {
    // console.log(req.body);
    
    switch (req.body.actionCase) {
        case "userRegistrationParkingStaff":
            res.json(await userRegisterationEmailParkingStaff(req.body.to,req.body.content));
            break;

        case "userRegistrationResident":
            res.json(await userRegisterationEmailResident(req.body.to,req.body.content));
            break;

        default:
            res.json(await sendMail(req.body.to,req.body.actionCase,JSON.stringify(req.body.content),JSON.stringify(req.body.content)));
            break;
    }
  
};
exports.mailerMethod = async function(data) {
    //console.log(data,"dataMethod");
    
    switch (data.actionCase) {
        case "sendForgotPasswordLink":
            return await sendForgotPasswordLink(data.to,data.content);
            break;

        case "sendConfirmationOfNewpasswordApply":
            return await sendConfirmationOfNewpasswordApply(data.to,data.content);
            break;

        case "userRegistrationParkingStaff":
            return await userRegisterationEmailParkingStaff(data.to,data.content);
            break;

        case "userRegistrationResident":
            return await userRegisterationEmailResident(data.to,data.content);
            break;

        default:
            return await sendMail(data.to,data.actionCase,JSON.stringify(data.content),JSON.stringify(data.content));
            break;
    }
  
}

async function sendConfirmationOfNewpasswordApply(to,content) {
    try{
        var resultSet=[];
        var subject = 'Password Changed Succesfully - American Wrecker Service'
        var source = fs.readFileSync(__dirname + '/mailTemplate/sendConfirmationOfNewpasswordApply.html', 'utf8');
        var template = Handlebars.compile(source);
        var data = { "logo":process.env.REACTAPPURL+'/static/media/logo.c93adaab.png',"username": content.username, "email": content.email,"password": content.password };
        var htmlContent = template(data);
        var textContent = 'Text:Hi '+content.username+',<br />You have successfully change your account password.<br />Here is your account details.<br />Username:'+content.username+'<br>New Password:'+content.password;    
        resultSet = await sendMail(to,subject,textContent,htmlContent);
        // console.log('resultSet',resultSet);
        return resultSet
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

async function sendForgotPasswordLink(to,content) {
    try{
        var resultSet=[];
        var subject = 'Account - American Wrecker Service'
        var source = fs.readFileSync(__dirname + '/mailTemplate/sendForgotPasswordLink.html', 'utf8');
        var template = Handlebars.compile(source);
        var data = { "logo":process.env.REACTAPPURL+'/static/media/logo.c93adaab.png',"username": content.username,"email": content.email, "token": content.token,"tokenexpireon": content.tokenexpireon, "URL": process.env.REACTAPPURL+'/recover/'+content.token };
        var htmlContent = template(data);
        var textContent = 'Click <a href="'+process.env.REACTAPPURL+'/recover/'+content.token+'">this link</a> to recover your account. <a href="'+process.env.REACTAPPURL+'/recover/'+content.token+'">This link</a> only valid for next 24 Hours (ie: '+content.tokenexpireon+'). If link is not working you can simply copy this '+process.env.REACTAPPURL+'/recover/'+content.token+' link  and paste in your browsers address bar.';    
        resultSet = await sendMail(to,subject,textContent,htmlContent);
        return resultSet
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

async function userRegisterationEmailParkingStaff(to,content) {
    try{
        var resultSet=[];
        var subject = 'Welcome to Team American Wrecker Service'
        var source = fs.readFileSync(__dirname + '/mailTemplate/user-register-parkingstaff.html', 'utf8');
        var template = Handlebars.compile(source);
        var data = { "logo":process.env.REACTAPPURL+'/static/media/logo.c93adaab.png',"username": content.username,"email": content.email, "password": content.password };
        var htmlContent = template(data);
        var textContent = 'Text:Hi '+content.username+',<br />Welcome to Team Amercian Wrecker Service.<br />Here is your account(Parking Staff) details.<br />Username:'+content.username+'<br>Email:'+content.email+'<br>Password:'+content.password;    
        resultSet = await sendMail(to,subject,textContent,htmlContent);
        return resultSet
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
async function userRegisterationEmailResident(to,content) {
    try{
        var resultSet=[];
        var subject = 'Resident Registration at American Wrecker Service'
        var source = fs.readFileSync(__dirname + '/mailTemplate/user-register-resident.html', 'utf8');
        var template = Handlebars.compile(source);
        var data = { "logo":process.env.REACTAPPURL+'/static/media/logo.c93adaab.png',"username": content.username, "email": content.email,"password": content.password };
        var htmlContent = template(data);
        var textContent = 'Text:Hi '+content.username+',<br />Amercian Wrecker Service welcomes you into the System.<br />Here is your account(Resident) details.<br />Username:'+content.username+'<br>Password:'+content.password;    
        resultSet = await sendMail(to,subject,textContent,htmlContent);
        // console.log('resultSet',resultSet);
        return resultSet
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
async function sendMail(to,subject,textContent,htmlContent) {
    try{
        var resultSet=[];

        let transporter = nodemailer.createTransport({
            
            // service: 'gmail',
            //       auth: {
            //         user: process.env.MAILSERVER_USERNAME,
            //       pass: process.env.MAILSERVER_PASSWORD
            // } 


             host: "smtp.office365.com",
             port: 587,
             secure: false,
             auth: {
               user: process.env.MAILSERVER_USERNAME,
               pass: process.env.MAILSERVER_PASSWORD
             }

        });
        let info = await transporter.sendMail({
            from: '"'+process.env.MAILSERVER_SENDER_NAME+'" <'+process.env.MAILSERVER_USERNAME+'>', // sender address
            to: to, // list of receivers
            subject: subject+'-'+new Date(), // Subject line
            text: textContent,
            html: htmlContent
        });
        // console.log('MAILRESP',info);
       await logMailToDb({"to":to,"subject":subject,"textContent":textContent,"htmlContent":htmlContent,"info":info});

        resultSet = {
            status: "success",
            response: "Mail sent"
        };
        return resultSet
    } catch(err){
        await logMailToDb({"to":to,"subject":subject,"textContent":textContent,"htmlContent":htmlContent,"info":{"messageId":"Mail not sent.","status":error_handler.GetCommonError(err)}})
        var resultSet=[];

        resultSet = {
            status: "error",
            response: error_handler.GetCommonError(err),
            resultSet: err
        };
        // console.log();
        return resultSet
    }
}

async function logMailToDb(info) {
    // console.log('loginfo', info )
    try{
        
        dbinstance.mailLog.create({ 
            to: info.to,
            subject: info.subject,
            htmlContent: info.htmlContent,
            textContent: info.textContent,
            messageId:info.info.messageId.replace("<","").replace(">",""),
            rawResponse: JSON.stringify(info.info),
            updatedAt: new Date(),
            createdAt: new Date()
        }
        ).then(resultset => {
            // console.log('resultset', resultset )
            if (resultset === null) {
                return { status: "error", response: "Error while adding MailLog." };
            } else {
                return { status: "success", response: "MailLog added successfully." };
            }
          })
    }catch(err){
        console.log('Error while log MailLog into db. Response : ', err )
    }
}





exports.mailLogs = async function(req, res, next) {
    const {rowsPerPage, page} = req.body 
    const offset = page*rowsPerPage
    const totalCount = await dbinstance.mailLog.count()
    let result = await dbinstance.mailLog.findAll({
        raw:true,
        offset: Number(offset),
        limit: Number(rowsPerPage)
    }) 

res.json({ status: "success", response: result, totalCount:totalCount });
};