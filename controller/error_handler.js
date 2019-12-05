"user strict";

exports.GetCommonError = function(err) {
    //console.log("****************************Error occured****************************Details Start from here********************************************************");
    //console.log("Error details", err);
    //console.log("****************************Error occured****************************Details Ends here********************************************************"    );
    switch (err.name) {
        case "SequelizeUniqueConstraintError":
            return err.original.sqlMessage;

        case "SequelizeDatabaseError":
            return err.original.sqlMessage;

        default:
            return "Something went wrong.";
    }
};