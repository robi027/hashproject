const express = require("express");
const axios = require("axios");
const router = express.Router();
const db = require("../firestore");
const resourceCollection = db.collection("resources");
const authCollection = db.collection("auth");
const verifyToken = require('./verifyToken');
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";

const deploymentsbaru = async () => {
  try {
    var resource= [];
    var response = await resourceCollection.get();
    response.forEach(doc => {
      var name = doc.data().name;
      var type = doc.data().type;
      var slot = doc.data().slot;
      // if(type == "be"){
      //   const result = Object.keys(slot).reduce((acc, key) =>{
      //     acc[key] = slot[key] + "api/deployments"
      //     return acc;
      //   }, {});
      //   resource.push({ name, slot: result});
      // }
      if(type == "be"){
        for (var prop in slot){
          slot[prop] = slot[prop]+"api/deployments";
        }        
        resource.push({ name, slot});
      }else{
        resource.push({ name, slot });
      }
    })
    return resource;
  } catch (error) {
    console.log(error);
  }
}

const deployments = async (params) => {
  try {    
    var item = [];
    var response = await resourceCollection.doc(params).get();
    for (var prop in response.data().slot) {
      var itemObj = prop;
      var itemValue = response.data().slot[prop]+"api/deployments"
      item.push({
        [itemObj] : itemValue
      })
    }
    return item;
  } catch (error) {
    console.log(error);
  }  
}

const basicAuth = async () => {
  try {
    var response = await authCollection.where('status', '==', true).get();
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
}

router.get("/deployments", async (req, res) => {
  try {
    var deploy = await deploymentsbaru();
    for (let i = 0; i < deploy.length; i++) {
      var result = deploy[i].name;
      var resultslot = deploy[i].slot;
      console.log(result);
      for(var prop in resultslot){
        console.log(prop);
        console.log(resultslot[prop]);
        var hasil = resultslot[prop];
        
        var response = await axios.get(hasil, await basicAuth(), (res) =>{
          try {
            
              res = response.data;
          } catch (error) {
            console.log("Error Callback" + error);
          }          
        });
        
        
        // console.log(datanya);
      }
      // for(var prop in resultslot){
      //   var hello = resultslot[prop];
        
        
        // var response = await axios.get(resulthasilslot, await basicAuth());
        // var datanya = response.data;
      // }
      // console.log(itemslot);
      // item.push({
      //   name : result,
      //   resultslot
      // })
    }
    res.status(200).send(itemslot);
  } catch (error) {
    console.error("Errornya " + error);
  } 
})

router.get("/logstream", verifyToken, async (req, res) => {
  try {
    var response = await axios.get(logstream, await basicAuth())
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
})

router.get("/resources", verifyToken, async (req, res) => {
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

router.post("/resources", verifyToken, async (req, res) => {
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

router.put("/resources/:id", verifyToken, async (req, res) => {
  try {
    var slot = req.body.slot;
    var data = { name: req.body.name, slot, type: req.body.type };
    await resourceCollection.doc(req.params.id).update(data);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
  }
})

router.delete("/resources/:id", verifyToken, async (req, res) => {
  try {
    await resourceCollection.doc(req.params.id).delete();
    res.status(200).send({ id: req.params.id, Message: "Delete Success"});
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
  }
})

//GET ALL BASICAUTH
router.get("/auth", verifyToken, async (req, res) => {
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
router.post("/auth", verifyToken, async (req, res) => {
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
                password: hashedPassword,
                status: false
            })
      res.status(200).send("Success adding auth. " + response.id);
        }
  } catch (error) {
    res.status(500).send("There was a problem adding the information to the database. " + error);
  }
})

//UPDATE EXISTING BASICAUTH
router.put("/auth/:id", verifyToken, async (req, res) => {
  try {
    var encode = req.body.username + ":" + req.body.password;
    console.log(encode);
    var buff = new Buffer(encode);  
    var base64data = buff.toString('base64');
    console.log(base64data);
    var hashedPassword = await bcrypt.hash(req.body.password, 8);
    var response = await authCollection.doc(req.params.id).update({
      basicAuth : base64data,
      username : req.body.username,
      password : hashedPassword
      })
      res.status(200).send("Success updating auth. " + response.id);
  } catch (error) {
    res.status(500).send("There was a problem updating auth. " + error);
  }
})

//DELETES SINGLE BASICAUTH
router.delete("/auth/:id", verifyToken, async (req, res) => {
  try {
    await authCollection.doc(req.params.id).delete();
    res.status(200).send({ id: req.params.id, Message: "Delete Success"});
  } catch (error) {
    console.log(error);
    res.status(500).send({Message : "Internal Server Error"});
  }
})

module.exports = router;