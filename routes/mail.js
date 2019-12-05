var express = require("express");
var router = express.Router();
const mailFunc = require('../controller/ctr_mailer')
/* GET home page. */
router.get("/", async function(req, res, next) {
   const resp = await mailFunc.testmailerApi();
     res.send(resp);
});

module.exports = router;