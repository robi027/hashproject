var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var userCollection = require("../firestore");
var verifyToken = require('./verifyToken');
//configure jwt
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.use(bodyParser.json());

router.post('/login', async (req, res) => {
  try {
    var user, idUser, pass;
    var snapshot = await userCollection.where('email', '==', req.body.email).get();
    snapshot.forEach(doc => {
      idUser = doc.id;
      user = doc.data().email;
      pass = doc.data().password;
      passwordIsValid = bcrypt.compareSync(req.body.password, pass);
    });

    if (user && passwordIsValid) {
      // if user is found and password is valid
      // create a token
      var token = jwt.sign({ id: idUser }, config.secret, {
        expiresIn: 2592000 // expires in 24 hours
      });
      // return the information including token as JSON
      res.status(200).send({ auth: true, token: token });
    } else if (!user) {
      res.status(404).send('No user found.');
    } else if (!passwordIsValid) {
      res.status(404).send('Incorrect Password.');
    }
  } catch (error) {
    res.status(500).send('Error on the server.' + error);
  }
});

router.post('/check', async (req, res) => {
  try {
    var user, idUser, pass;
    var snapshot = await userCollection.where('email', '==', req.body.email).get();
    snapshot.forEach(doc => {
      idUser = doc.id;
      user = doc.data().email;
      pass = doc.data().password;
    });
    

    if (user) {
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
    var token = jwt.sign({ id: idUser }, config.secret, {
      expiresIn: 36000 // expires in 24 hours
    });
    res.status(200).send("Success registering user.\n Token: " + token);
    }
  } catch (error) {
    res.status(500).send('Error on the server.' + error);
  }
});

router.get('/logout', async (req, res) => {
  //  res.removeHeader('x-access-token');
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', async (req, res) => {
  try {
    var user, idUser, pass;
    var snapshot = await userCollection.where('email', '==', req.body.email).get();
    snapshot.forEach(doc => {
      idUser = doc.id;
      user = doc.data().email;
      pass = doc.data().password;
    });

    if (user) {
      res.status(200).send("User already exist.");
    } else {
      var hashedPassword = await bcrypt.hash(req.body.password, 8);

      var response = await userCollection.add({
        email: req.body.email,
        password: hashedPassword
      })
      res.status(200).send("Success adding user. " + response.id);
    }
  } catch (error) {
    res.status(500).send('Error on the server.' + error);
  };
});

router.get('/me', verifyToken, async (req, res) => {
  try {
      var getData = await userCollection.doc(req.userId).get();
      res.send(getData.data().email);
  } catch (error) {
      res.status(500).send("There was a problem finding the user. " + error);
  }
});

module.exports = router;