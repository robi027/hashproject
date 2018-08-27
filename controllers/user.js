var bodyParser = require("body-parser");
var userCollection = require("../firestore");
const express = require("express");
const app = express();

  app.use(bodyParser.json());
  //Menampilkan Data
  app.get("/users", function(req, res, next) {
    let allUser = [];
    userCollection
      .get()
      .then(documentSet => {
        documentSet.forEach(doc => {
          const myData = doc.data();
          allUser.push({
            Username: myData.username,
            Password: myData.password 
          });
        });
        res.json({
          statusCode: "200",
          statusResponse: "Ok",
          message: "All Users",
          data: allUser
        });
      })
      .catch(err => {
        res.json({
          statusCode: "500",
          statusResponse: "Error",
          message: err
        });
        console.log("Error", err);
      });
  });
  //Menambahkan Data
  app.post("/user", function(req, res) {
    data = userCollection
      .add({
        username: req.body.username,
        password: req.body.password
      })
      .then(ref => {
        res.json({
          statusCode: "200",
          statusResponse: "Ok",
          message: "Data Berhasil Di Inputkan",
          dataid: ref.id
        });
      })
      .catch(err => {
        res.json({
          statusCode: "500",
          statusResponse: "Error",
          message: err
        });
      });
  });

  //Menghapus Data
  app.delete('/user', function(req, res){
    let id = req.body.id;
    userCollection.doc(id).delete()
    .then(() => {
      res.json({
        statusCode: "200",
        statusResponse: "Ok",
        message: "Data Berhasil Di Hapus",
        dataid: id
      })
    })
    .catch(err => {
      res.json({
        statusCode: "500",
        statusResponse: "Error",
        message: err
      });
    });
  });

  //Mengedit Data
  app.put('/user', function(req, res){
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    userCollection.doc(id).update({
      username : username,
      password : password
    })
    .then(function(){
      res.json({
        statusCode: "200",
          statusResponse: "Ok",
          message: "Data Berhasil Di Gantis",
          dataid: id
      })
    })
    .catch(err => {
      res.json({
        statusCode: "500",
        statusResponse: "Error",
        message: err
      });
    });
  });

  //Mengquery Data
  app.get("/user", function(req, res){
    userCollection.where('username', '==' , req.query.username).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        res.send(doc.data());
      })
    })
    .catch(err => {
      console.log(err);
    })
  })

  module.exports = app;