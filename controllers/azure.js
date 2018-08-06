var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var app = require("../app");
const axios = require("axios");
const express = require ('express');
const router = express.Router();

//firebase
const admin = require("firebase-admin");
var serviceAccount = require("../hashprojectfs.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const userCollection = db.collection("user");


