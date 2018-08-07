const express = require("express");
var axios = require("axios");
const router = express.Router();


// const url = "https://dummy-hash.scm.azurewebsites.net/basicauth";
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

module.exports = router;