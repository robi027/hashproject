const express = require("express");
var axios = require("axios");
const router = express.Router();


<<<<<<< HEAD
// const url = "https://dummy-hash.scm.azurewebsites.net/basicauth";
=======
>>>>>>> refs/remotes/origin/staging
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
    let response = await axios.get(deployments, header)
    res.send(response.data);
    console.log("hello");
  } catch (error) {
    console.error(error);
  }
  next();
});
<<<<<<< HEAD
=======

router.get("/logstream/", async (req, res, next) =>{
  try {
    let response = await axios.get(logstream, header)
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
})
>>>>>>> refs/remotes/origin/staging

module.exports = router;