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
    var id;
    var user;
    var pass;
    var passwordIsValid;
    var snapshot = await userCollection.where('email', '==' , req.body.email).where('password', '==' , req.body.password).get();
    snapshot.forEach(doc => {
      user = doc.data().email;
      pass = doc.data().password;
      console.log(user);
      console.log(pass);
      id = doc.id;
      console.log(id);
      
      // check if the password is valid
      passwordIsValid = bcrypt.compareSync(req.body.password, doc.data().password);      
    });
    if (user && pass) {
      console.log(req.body.email + ' found.');
      console.log(req.body.password + ' found.');
      res.status(200).send(req.body.email + ' found.');
      res.status(200).send(req.body.password + ' found.');
    } else if (!user) {
      console.log('No user found.');
      res.status(404).send('No user found.');
    } else if (!passwordIsValid) { 
      res.status(401).send({ auth: false, token: null });
    }
  

  } catch (error) {
    console.log(error);
    res.status(500).send('Error on the server.' + error);
  }
});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', async function(req, res) {
    try {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        var response = await userCollection.add({
              email: req.body.email,
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