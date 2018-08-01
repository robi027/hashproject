var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false});

// module.exports = function(app){
//     app.get("/azure", function(req, res){
//         res.send("hello");
//     });
// }
const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next){
    res.send("hello");
})

module.exports = router;