var bodyParser = require("body-parser");
<<<<<<< HEAD
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var app = require("../app");
const axios = require("axios");
const express = require ('express');
const router = express.Router();

//firebase
const admin = require("firebase-admin");
var serviceAccount = require("../hashprojectfs.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const userCollection = db.collection("user");


=======
// var urlencodedParser = bodyParser.urlencoded({ extended: false});

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
>>>>>>> 4d7460e41a31458103da1ef0f5c5aabd8225a71f
