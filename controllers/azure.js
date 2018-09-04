const express = require("express");
var axios = require("axios");
const router = express.Router();
var db = require("../firestore");
var resourceCollection = db.collection("resources");
var authCollection = db.collection("auth");
var verifyToken = require('./verifyToken');
var bcrypt = require('bcryptjs');
var bodyParser = require("body-parser");
router.use(bodyParser.json());

const deployments = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";

var basicAuth = async () => {
  try {
    var response = await authCollection.get();
    response.forEach(doc => {
    data = doc.data().basicAuth;
    });
    var header = {
      headers: {
        "Authorization" : "Basic " + data
      }
    }
    return header;
  } catch (error) {
    console.log(error);
  }
}

router.get("/deployments", async (req, res, next) => {
  try {
    //auth(req.query.username, req.query.password);
    //console.log(req.query.username, req.query.password)
    var response = await axios.get(deployments, await basicAuth())
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
})

router.get("/logstream", async (req, res, next) => {
  try {
    var response = await axios.get(logstream, header)
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
})

router.post("/resources", async (req, res, next) =>{
  try{
    var id = req.body.id;
    if(id){
      var response1 = await resourceCollection.doc(id).get();
      res.status(200).send(response1.data());
    } else{
      var response = await resourceCollection.get();
      res.status(200).send(response.data());
    }
    // console.log(Object.keys(response.data()));
  }catch(error) {
    console.log(error);
  }
})

router.post("/encode", async (req, res, next) => {
  try {
    var username = req.body.username;
    var pass = req.body.password;    
    var encode = username + ":" + pass;
    console.log(encode);
    var buff = new Buffer(encode);  
    var base64data = buff.toString('base64');
    console.log(base64data);
    res.send('"' + encode + '" converted to Base64 is "' + base64data + '"'); 
  } catch (error) {
    res.send(error);
  }
})

router.get("/decode/:data", async (req, res, next) => {
  try {
    let data = req.params.data;  
    let buff = new Buffer(data, 'base64');  
    let text = buff.toString('ascii');

    res.send('"' + data + '" converted from Base64 to ASCII is "' + text + '"');   
  } catch (error) {
    console.error(error);
  }
})

//GET ALL BASICAUTH
router.get("/auth", async (req, res) => {
  try {
    let all = [];
    var response = await authCollection.get();
    response.forEach(doc => {
      all.push({
        basicAuth: doc.data().basicAuth,
        username: doc.data().username,
        password: doc.data().password
      });
    });
    res.status(200).send(all);
  } catch (error) {
    res.status(500).send("There was a problem retrieving the information from the database. " + error);
  }
})

//ADD NEW BASICAUTH
router.post("/auth", async (req, res) => {
  try {
    var encode = req.body.username + ":" + req.body.password;
    console.log(encode);
    var buff = new Buffer(encode);  
    var base64data = buff.toString('base64');
    console.log(base64data);

    var user, idUser, pass, basicAuth;
        var snapshot = await authCollection.where('username', '==', req.body.username).get();
        snapshot.forEach(doc => {
            idUser = doc.id;
            basicAuth = doc.data().basicAuth;
            user = doc.data().username;
            pass = doc.data().password;
        });
    
        if (user) {
         res.status(200).send("Auth already exist.");
        } else {
            var hashedPassword = await bcrypt.hash(req.body.password, 8);

            var response = await authCollection.add({
                basicAuth: base64data,
                username: req.body.username,
                password: hashedPassword
            })
      res.status(200).send("Success adding auth. " + response.id);
        }
  } catch (error) {
    
  }
})

//UPDATE EXISTING BASICAUTH
router.put("/auth", async (req, res) => {
  try {
    var encode = req.body.username + ":" + req.body.password;
    console.log(encode);
    var buff = new Buffer(encode);  
    var base64data = buff.toString('base64');
    console.log(base64data);
    var hashedPassword = await bcrypt.hash(req.body.password, 8);
    var response = await authCollection.doc(req.body.id).update({
      basicAuth : base64data,
      username : req.body.username,
      password : hashedPassword
      })
      res.status(200).send("Success updating auth. " + response.id);
  } catch (error) {
    res.status(500).send("There was a problem updating auth. " + error);
  }
})

module.exports = router;