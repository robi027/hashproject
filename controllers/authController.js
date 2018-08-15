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
    var id, user, pass, passwordIsValid;
    var snapshot = await userCollection.where('email', '==' , req.body.email).get();
    snapshot.forEach(doc => {
      user = doc.data().email;
      pass = doc.data().password;
      console.log('email: ' + user);
      console.log('hashedpassword: ' + pass);
      id = doc.id;
      console.log('id: ' + id);
      
      // check if the password is valid
      passwordIsValid = bcrypt.compareSync(req.body.password, doc.data().password);      
    });
    if (user && passwordIsValid) {
      console.log(req.body.email + ' input found.');
      console.log(req.body.password + ' input found.');
      
      // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    return res.status(200).send({ auth: true, token: token });
    //return res.status(200).send('name: ' + req.body.email + ' found.\n password: ' + req.body.password + ' found.');
    } else if (!user) {
      console.log('No user found.');
      return res.status(404).send('No user found.');
    } else if (!passwordIsValid) { 
      return res.status(401).send({ auth: false, token: null });
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

router.get('/me', verifyToken, async function(req, res, next) {
  try {
    const response = await userCollection.doc(req.userId).get();
    res.send(response.data());
    console.log(response.id);
    console.log(response.data());
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;