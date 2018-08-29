const express = require("express");
var axios = require("axios");
const router = express.Router();
var db = require("../firestore");
var resourceCollection = db.collection("resources");
var bodyParser = require("body-parser");
router.use(bodyParser.json());


const deployments = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";
// const username = "$robi027";
// const password = "mnbvcxz12327";
var header = {
  headers: {
    "Authorization" : "Basic cm9iaTAyNzptbmJ2Y3h6MTIzMjc="
  }
}

router.get("/deployments/", async (req, res, next) => {
  try {
    var response = await axios.get(deployments, header)
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
  next();
})

router.get("/logstream/", async (req, res, next) =>{
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

module.exports = router;