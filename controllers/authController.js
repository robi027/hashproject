var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var userCollection = require("../firestore");

var verifyToken = require('./verifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
//var User = require('../user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.post('/login', async function(req, res) {
  try {
    var snapshot = await userCollection.where('username', '==' , req.body.username).get();
    snapshot.forEach(doc => {
      if (doc) {
        return res.status(200).send(req.body.username + ' found.');
      } else if (!doc) {
        return res.status(404).send(req.body.username + ' not found.');
      }
      })
  } catch (error) {
    console.error(error);
  }
});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', async function(req, res) {
    try {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        var response = await userCollection.add({
              username: req.body.username,
              password: hashedPassword
            })
              res.json({
                statusCode: "200",
                statusResponse: "Ok",
                message: "Data Berhasil Di Inputkan",
                dataid: response.id
              });
      } catch (error) {
        res.json({
            statusCode: "500",
            statusResponse: "Error",
            message: error
          });
        console.error(error);
      };
});

router.get('/me', verifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

module.exports = router;