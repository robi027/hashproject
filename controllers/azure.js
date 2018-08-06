const express = require("express");
const router = express.Router();

var bodyParser = require("body-parser");
var kudu = require("kudu-api")({
    website: "https://dummy-hash.scm.azurewebsites.net/",
    username: "$robi027",
    password: "mnbvcxz12327"
});
var urlencodedParser = bodyParser.urlencoded({ extended: false});

// module.exports = function(app){
//     app.get("/azure", function(req, res){
//         res.send("hello");
//     });
// }

router.get("/", function(req, res, next){
    kudu.scm.info(function (err, info){
        if (err) throw err;
        console.log(err);
    });
});

module.exports = router;