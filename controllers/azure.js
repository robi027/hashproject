const express = require("express");
var axios = require("axios");
const router = express.Router();


// const url = "https://dummy-hash.scm.azurewebsites.net/basicauth";
<<<<<<< HEAD
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
=======
const development = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
// const username = "$robi027";
// const password = "mnbvcxz12327";

router.get("/", (req,res) =>{

  axios.get(development, {
      headers: {
          "Authorization" : "Basic cm9iaTAyNzptbmJ2Y3h6MTIzMjc="}

        })
        
      .then((response)=>{
         console.log("Success", response);
        JSON.parse(JSON.stringify(response.data));
      })
      .catch((err) => {
          console.log("Error", err);
      })
})
>>>>>>> 4ec1cb02d92866475ac9645df5e823050e2e3e50

module.exports = router;