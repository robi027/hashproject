var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const admin = require("firebase-admin");
var serviceAccount = require("../hashprojectfs.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const userCollection = db.collection("user");

module.exports = function(app) {
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
  app.post("/user", urlencodedParser, function(req, res) {
    // data = req.body.username;
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
<<<<<<< HEAD
  app.get("/query/:user", function(req, res){
    //let username = req.params.ui;
    // console.log(req.params.username);
    userCollection.where('username', '==' , req.params.user).get()
=======
  app.get('/user', function(req, res, next){
    userCollection.where('username', '==' , req.query.username).get()
>>>>>>> e49b7802d756ea88b3970aa8bfa93c97e3980bcd
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
};
