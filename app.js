var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
require("url-search-params-polyfill");
require("dotenv").config();
var cors = require("cors");
var indexRouter = require("./routes/index");
var mailRouter = require("./routes/mail");
var ctr_auth = require("./controller/ctr_authentication.js");
var ctr_vehicles = require("./controller/ctr_vehicles.js");
var ctr_property = require("./controller/ctr_property.js");
var ctr_mailer = require("./controller/ctr_mailer.js");
var ctr_users = require("./controller/ctr_users.js");
var ctr_notification = require("./controller/ctr_notification.js");
var ctr_common = require("./controller/ctr_common.js");
var ctr_message = require("./controller/ctr_message.js");
var app = express();
app.use(cors());
// var APIKEYMIDDLEWARE = require("./middleware.js");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(APIKEYMIDDLEWARE());
app.use(logger('+++Method-:method | URL-:url | STATUS-:status | RESPTIME-:response-time | REFRER-:referrer | IP-:remote-addr | DATETIME-:date +++'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.route("/login/manager").post(ctr_auth.login);
app.route("/login/staff").post(ctr_auth.login);
app.route("/login/resident").post(ctr_auth.login);
app.route("/signup/resident").post(ctr_auth.signupAsResident);
app.route("/resident/addguest").post(ctr_auth.AddMyGuestAsResident);
app.route("/vehicles/getmyvehicles").post(ctr_vehicles.getMyVehiclesAsResident);

app
  .route("/vehicles/getmyvehicleSingle")
  .post(ctr_vehicles.getmyvehicleSingleAsResident);
app
  .route("/vehicles/isEnabled")
  .post(ctr_vehicles.toggleIsEnabledVehicleAsResident);
app.route("/vehicles/addmyvehicles").post(ctr_vehicles.AddMyVehiclesAsResident);
app
  .route("/vehicles/updatemyvehicle")
  .post(ctr_vehicles.UpdateMyVehiclesAsResident);

app.route("/resident/getmyguests").post(ctr_auth.getMyGuestsAsResident);

// admin routes start
app.route("/admin/GetAllManagers").post(ctr_users.GetAllManagersAsAdmin);
app.route("/admin/AddManager").post(ctr_users.AddManagerAsAdmin);

app.route("/admin/GetAllParkingStaff").post(ctr_users.GetAllParkingStaffAsAdmin);
app.route("/admin/AddParkingStaff").post(ctr_users.AddParkingStaffAsAdmin);


app.route("/admin/GetAllResident").post(ctr_users.GetAllResidentAsAdmin);
app.route("/admin/AddResident").post(ctr_users.AddResidentAsAdmin);

app.route("/admin/getguesttest").post(ctr_users.Getguesttest);
app.route("/admin/AddGuest").post(ctr_users.AddGuestAsAdmin);



app.route("/manager/GetAllParkingStaff").post(ctr_users.GetAllParkingStaffAsManager);
app.route("/manager/GetAllResident").post(ctr_users.GetAllResidentAsManager);
app.route("/manager/GetAllGuest").post(ctr_users.GetAllGuestAsManager);
app.route("/manager/GetAllProperty").post(ctr_property.GetAllPropertyAsManager);
// app.route("/manager/AddParkingStaff").post(ctr_users.AddParkingStaffAsAdmin);
// app.route("/property/Addproperty").post(ctr_property.AddPropertyAsAdmin);
app.route("/property/GetAllProperty").post(ctr_property.GetAllPropertyAsAdmin);
// admin routes end
app.route("/vehicles/GetAllVehiclesForCommon").post(ctr_vehicles.GetAllVehiclesForCommon);
app.route("/vehicles/GetAllVehiclesUnderAStaff").post(ctr_vehicles.GetAllVehiclesUnderAStaff);
app.route("/common/GetAllResident").post(ctr_users.GetAllResidentAsCommon);
app.route("/common/GetAllProperty").post(ctr_property.GetAllPropertyAsCommon);
app.route("/common/addNewUserCommon").post(ctr_users.AddNewUserForCommon);
app.route("/common/GetAllPropertyTypes").post(ctr_property.GetAllPropertyTypes);
app.route("/common/GetAllPropertyPermits").post(ctr_property.GetAllPropertyPermits);
app.route("/common/GetAllPropertyForParicularUser").post(ctr_property.GetAllPropertyForParicularUser);
app.route("/common/GetAllPropertyForAdmin").post(ctr_property.GetAllPropertyForAdmin);
app.route("/common/GetAllUnitsOfParticularPropertyForAdmin").post(ctr_property.GetAllUnitsOfParticularPropertyForAdmin);
app.route("/common/GetAllSpacesOfParticularPropertyForAdmin").post(ctr_property.GetAllSpacesOfParticularPropertyForAdmin);
app.route("/common/GetAllSpacesOfParticularUnitForAdmin").post(ctr_property.GetAllSpacesOfParticularUnitForAdmin);



//Notification
app.route("/common/getAllNotifications").post(ctr_notification.GetAllNotifications);
app.route("/common/getAllNotificationsPublishedByMe").post(ctr_notification.GetAllNotificationsPublishedByMe);
app.route("/common/getAllNotificationsForMe").post(ctr_notification.GetAllNotificationsForMe);
app.route("/common/addNotification").post(ctr_notification.AddNotification);
app.route("/common/getAllUsers").post(ctr_users.GetAllUsers);
app.route("/common/getAllUsersTable").post(ctr_users.GetUsersTable);

app.route("/common/getAllUserRoles").post(ctr_users.GetUserRoles)
app.route("/common/isEnabledChange").post(ctr_common.toggleIsEnabledStatus);
app.route("/common/isDeletedChange").post(ctr_common.toggleIsDeleted);

app.route("/common/updateUser").post(ctr_common.updateUserBasicDetails);
app.route("/common/GetUser").post(ctr_common.GetUserBasicDetails);

app.route("/common/updateResidentUser").post(ctr_common.updateResidentUserBasicDetails);
app.route("/common/GetResidentUser").post(ctr_common.GetResidentBasicDetails);

app.route("/common/GetAllMyProperty").post(ctr_common.GetAllMyProperty);
app.route("/common/addProperty").post(ctr_common.addProperty);
app.route("/common/getAllResiGuests").post(ctr_users.GetAllResiGuests);
app.route("/common/GetAllResidentsList").post(ctr_users.GetAllResidentsList);
app.route("/common/getAllPermits").post(ctr_property.GetAllPermits);

app.route("/common/getAllVehicleOptMake").post(ctr_vehicles.getAllVehicleOptMake);
app.route("/common/getAllvehicleOptModel").post(ctr_vehicles.getAllvehicleOptModel);

app.route("/common/CreateNewVehicleOption").post(ctr_vehicles.CreateNewVehicleOption);
// app.route("/common/GetAllmessage").post(ctr_message.GetAllmessage);

app.route("/common/createResident").post(ctr_auth.createResident);
app.route("/common/createResidentByStaff").post(ctr_auth.createResidentByStaff);
app.route("/admin/GetAllGuestssss").post(ctr_users.GetAllGuestAsAdmin);

app.route("/admin/ssssssss").post(ctr_users.msssgs);

app.route("/common/advsearch").post(ctr_common.advsearch);


app.route("/property/AddPropertyComplex").post(ctr_property.AddPropertyComplex);



app.route("/common/GetCountries").post(ctr_common.GetCountries);
app.route("/common/GetStates").post(ctr_common.GetStates);
app.route("/common/GetCities").post(ctr_common.GetCities);

app.route("/common/update_property").post(ctr_common.updateProperty)
app.route("/common/getProperty").post(ctr_common.getProperty)
app.route("/common/getAllPropertyUnitSpaces").post(ctr_common.getAllPropertyUnitSpaces)
app.route("/common/getUserVehicles").post(ctr_common.getUserVehicles)

app.route("/property/GetAllPropertyComplex").post(ctr_property.GetAllPropertyComplexAsAdmin);
app.route("/property/get_all_property_area_complex").post(ctr_property.GetAllPropertyComplexes);
app.route("/property/get_all_properties").post(ctr_property.GetAllProperties);
app.route("/property/add_new_resident_unit").post(ctr_property.AddNewResidentUnit);
app.route("/property/add_new_unit_space").post(ctr_property.AddNewUnitSpace);

app.route("/common/getAllResi").post(ctr_users.GetAllResi);

app.route("/property/getAllMyPropertiesComplex").post(ctr_property.getAllMyPropertiesComplex);
app.route("/property/getMySinglePropertyComplex").post(ctr_property.getMySinglePropertyComplex);
app.route("/property/updateMySinglePropertyComplex").post(ctr_property.updateMySinglePropertyComplex);

app.route("/property/GetAllMySpaces").post(ctr_property.GetAllMySpaces);
app.route("/property/test").post(ctr_property.test);

app.route("/property/UpdateManagerToProperty").post(ctr_property.UpdateManagerToProperty);
app.route("/property/GetManagerOfProperty").post(ctr_property.GetManagerOfProperty);
app.route("/property/GetAssManagerOfProperty").post(ctr_property.GetAssManagerOfProperty);

app.route("/property/update_unit_space").post(ctr_property.updateUnitSpace);
app.route("/property/get_unit_space").post(ctr_property.getUnitSpace);
app.route("/property/release_unit_space").post(ctr_property.releaseUnitSpace);
app.route("/vehicles/fetchVehiclesWithUserId").post(ctr_vehicles.fetchVehiclesWithUserId);

app.route("/common/GetAllResidentUnits").post(ctr_property.GetAllResidentUnits);

app.route("/mail").post(ctr_mailer.mailerApi);
app.route("/mailLogs").post(ctr_mailer.mailLogs);
app.use("/mail",mailRouter);

app.route("/forgot").post(ctr_auth.forgot);
app.route("/recoverPasswordWithHash").post(ctr_auth.recoverPasswordWithHash);
app.route("/modifyPasswordWithOldPassword").post(ctr_auth.modifyPasswordWithOldPassword);

app.route("/common/renameSingle").post(ctr_common.renameSingle);
app.route("/common/renameBulk").post(ctr_common.renameBulk);
app.route("/common/GetAllResidentsUnderAStaff").post(ctr_users.GetAllResidentsUnderAStaff);
module.exports = app;
