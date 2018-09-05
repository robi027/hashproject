var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require("../firestore");
var userCollection = db.collection("user");
var verifyToken = require('./verifyToken');
var bcrypt = require('bcryptjs');

router.use(bodyParser.json());

// CREATES A NEW USER
router.post('/', async (req, res) => {
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
        res.status(500).send("There was a problem adding the information to the database. " + error);
    }
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', async (req, res) => {
    try {
        let allUser = [];
        var response = await userCollection.get();
        response.forEach(doc => {
            idUser = doc.id;
            user = doc.data().email;
            pass = doc.data().password;
            allUser.push({
                email: user,
                password: pass
            })
        })
        res.status(200).send(allUser);
    } catch (error) {
        res.status(500).send("There was a problem retrieving the information from the database. " + error);
    }
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/', /* VerifyToken, */ async (req, res) => {
    try {
        var hashedPassword = await bcrypt.hash(req.body.password, 8);
        var response = await userCollection.doc(req.body.id).update({
            email : req.body.email,
            password : hashedPassword
        })
        res.status(200).send("Success updating the user. " + response.id);
    } catch (error) {
        res.status(500).send("There was a problem updating the user. " + error);
    }
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', async (req, res) => {
    try {
        await userCollection.doc(req.params.id).delete();
    res.status(200).send({ id: req.params.id, Message: "Delete Success"});
    } catch (error) {
        console.log(error);
        res.status(500).send({Message : "Internal Server Error"});
    }
})


module.exports = router;