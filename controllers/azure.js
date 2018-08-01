var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var app = require("../app");

app.get("/hash", function(req, res){
    res.send("hello")
})
