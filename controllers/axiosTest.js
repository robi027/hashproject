const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get("/", async (req, res, next) => {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/users');
          var data = response.data;
          res.send(data);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
});

module.exports = router;