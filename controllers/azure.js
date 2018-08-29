const express = require("express");
var axios = require("axios");
const router = express.Router();
<<<<<<< HEAD
var db = require("../firestore");
var resourceCollection = db.collection("resources");
var bodyParser = require("body-parser");
=======
var bodyParser = require("body-parser")
>>>>>>> d956e3e9253c3b1db9bbcb35d30ef05ec919d116
router.use(bodyParser.json());


const deployments = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";
// var username = req.body.username;
// var pass = req.body.password;
// var encode = username + ":" + pass;
// var buff = new Buffer(encode);  
// var base64data = buff.toString('base64');
// var header = {
//   headers: {
//     "Authorization" : "Basic "
//   }
// }

router.get("/deployments/", async (req, res, next) => {
  try {
    var response = await axios.get(deployments, header)
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
  next();
})

router.get("/logstream/", async (req, res, next) => {
  try {
    var response = await axios.get(logstream, header)
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
})

router.post("/resource", async (req, res, next) =>{
  try{
    var id = req.body.id;
    var response = await resourceCollection.doc(id).get();
    res.status(200).send(response.data());
    // console.log(Object.keys(response.data()));
  }catch(error) {
    console.log(error);
  }
})

router.get('/resource', async (req, res, next) => {
  try {
    var response = await resourceCollection.doc(id).update({
      name : name,
      type : type,
      slot : slot
    })
  } catch (error) {
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

module.exports = router;