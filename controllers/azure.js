const express = require("express");
var axios = require("axios");
const router = express.Router();
var db = require("../firestore");
var resourceCollection = db.collection("resources");
var authCollection = db.collection("auth");
var bodyParser = require("body-parser");
router.use(bodyParser.json());


const deployments = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";
// var username = req.body.username;
// var pass = req.body.password;
// var encode = username + ":" + pass;
// var buff = new Buffer(encode);  
// var base64data = buff.toString('base64');
var auth = (username, pass) => {
  var encode = username + ":" + pass;
  console.log(encode);
  var buff = new Buffer(encode);
  base64data = buff.toString('base64');
  console.log(base64data);
  return base64data;
}

var basicAuth = async () => {
  try {
    var response = await authCollection.get();
    response.forEach(doc => {
      data = doc.data().basicAuth;
    });
    var header = {
      headers: {
        "Authorization": "Basic " + data
      }
    }
    return header;
  } catch (error) {
    console.log(error);
  }
  console.log(header);
  return header;
}

router.get("/deployments/", async (req, res, next) => {
  try {
    var response = await axios.get(deployments, await basicAuth())
    res.send(response.data);
  } catch (error) {
    console.error("Errornya " + error);
  }
  next();
})

router.get("/logstream/", async (req, res, next) => {
  try {
    var response = await axios.get(logstream, await basicAuth())
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
})

router.get("/resources", async (req, res, next) => {
  try {
    var allResources = [];
    var id = req.query.id;
    if (id) {
      var response = await resourceCollection.doc(id).get()
      res.status(200).send(response.data())
    } else if (!id) {
      var response = await resourceCollection.get()
      response.forEach(doc => {
        allResources.push(doc.data())
      })
      res.status(200).send(allResources);
    }
    // console.log(Object.keys(response.data()));
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
  }
})

router.post("/resources", async (req, res, next) => {
  try {
    var slot = req.body.slot;
    var data = { name: req.body.name, slot, type: req.body.type };
    await resourceCollection.add(data);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
  }
})

router.put("/resources", async (req, res, next) => {
  try {
    var slot = req.body.slot;
    var data = { name: req.body.name, slot, type: req.body.type };
    await resourceCollection.doc(req.body.id).update(data);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
  }
})

router.delete("/resources", async (req, res, next) => {
  try {
    await resourceCollection.doc(req.body.id).delete();
    res.status(200).send({ id: req.body.id, Message: "Delete Success"});
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
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