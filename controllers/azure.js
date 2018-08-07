const express = require("express");
var axios = require("axios");
const router = express.Router();


// const url = "https://dummy-hash.scm.azurewebsites.net/basicauth";
const deployments = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
const logstream = "https://dummy-hash.scm.azurewebsites.net/api/logstream";
// const username = "$robi027";
// const password = "mnbvcxz12327";
/*
router.get("/", (req,res) =>{

  axios.get(deployments, {
      headers: {
          "Authorization" : "Basic cm9iaTAyNzptbmJ2Y3h6MTIzMjc="}

        })
        
      .then((response)=>{
         console.log("Success", response);
         //JSON.parse(JSON.stringify(response.data))
        res.send(response.data);
      })
      .catch((err) => {
          console.log("Error", err);
      })
})
*/
router.get("/", async (req, res, next) => {
  try {
    const response = await axios.get(deployments, {
      headers: {
          "Authorization" : "Basic cm9iaTAyNzptbmJ2Y3h6MTIzMjc="}

        })
    res.send(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;