const express = require("express");
var axios = require("axios");
const router = express.Router();

<<<<<<< HEAD
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false});
=======
>>>>>>> 4ec1cb02d92866475ac9645df5e823050e2e3e50

// const url = "https://dummy-hash.scm.azurewebsites.net/basicauth";
const development = "https://dummy-hash.scm.azurewebsites.net/api/deployments";
// const username = "$robi027";
// const password = "mnbvcxz12327";

<<<<<<< HEAD
=======
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