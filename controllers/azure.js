const express = require("express");
var axios = require("axios");
const router = express.Router();


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

module.exports = router;