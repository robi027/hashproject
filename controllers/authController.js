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

router.post('/login', async function (req, res) {
  try {
    var user, idUser, pass;
    var snapshot = await userCollection.where('email', '==', req.body.email).get();
    snapshot.forEach(doc => {
      idUser = doc.id;
      user = doc.data().email;
      pass = doc.data().password;
      
    });

    passwordIsValid = bcrypt.compare(req.body.password, pass);

    if (user && passwordIsValid) {
      // if user is found and password is valid
      // create a token
      var token = jwt.sign({ id: idUser }, config.secret, {
        expiresIn: 36000 // expires in 24 hours
      });

      // return the information including token as JSON
      res.status(200).send({ auth: true, token: token });

    } else if (!user) {
      res.status(404).send('No user found.');
    }
  } catch (error) {
    res.status(500).send('Error on the server.' + error);
  }
});

router.post('/check', async function (req, res) {
  try {
    var user, idUser, pass;
    var snapshot = await userCollection.where('email', '==', req.body.email).get();
    snapshot.forEach(doc => {
      idUser = doc.id;
      user = doc.data().email;
      pass = doc.data().password;
    });
    passwordIsValid = bcrypt.compare(req.body.password, pass);

    if (user && passwordIsValid) {
      // if user is found and password is valid
      // create a token
      var token = jwt.sign({ id: idUser }, config.secret, {
        expiresIn: 36000 // expires in 24 hours
      });

      // return the information including token as JSON
      res.status(200).send({ auth: true, token: token });

    } else if (!user) {
      var hashedPassword = await bcrypt.hash(req.body.password, 8);

      var response = await userCollection.add({
        email: req.body.email,
        password: hashedPassword
    })
    res.json({
      statusCode: "200",
      statusResponse: "Ok",
      message: "Data Berhasil Di Inputkan",
      dataid: response.id
    })
    }
  } catch (error) {
    res.status(500).send('Error on the server.' + error);
  }
});

router.get('/logout', function (req, res) {
  //  res.removeHeader('x-access-token');
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', async function (req, res) {
  try {
    var hashedPassword = await bcrypt.hash(req.body.password, 8);

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

router.get('/me', verifyToken, async function (req, res, next) {
  // res.send(req.userId);
  var getData = await userCollection.doc(req.userId).get();
  res.send(getData.data().email);
  // User.findById(req.userId, { password: 0 }, function (err, user) {
  //   if (err) return res.status(500).send("There was a problem finding the user.");
  //   if (!user) return res.status(404).send("No user found.");
  //   res.status(200).send(user);
  // });
});

module.exports = router;