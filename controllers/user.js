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
  app.get("/user", function(req, res, next) {
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

  app.delete("/user/tambah-data/:item", urlencodedParser, function(req, res) {
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

  app.post('/user/delete-data', urlencodedParser, function(req, res){
    data = data.filter(function(todo){
      return todo.item.replace(/ /g, '-') !== req.params.item;
    }) 
    res.json(data);
  })
  
};
