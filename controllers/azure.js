const express = require("express");
var axios = require("axios");
const router = express.Router();


const deployments = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";
// const username = "$robi027";
// const password = "mnbvcxz12327";

router.get("/", async (req, res, next) => {
  try {
    const response = await axios.get(deployments, {
      headers: {
          "Authorization" : "Basic cm9iaTAyNzptbmJ2Y3h6MTIzMjc="}
        })
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;