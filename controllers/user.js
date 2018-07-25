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

  app.post("/user", urlencodedParser, function(req, res){
      var addDoc = userCollection.add({
          username : "coba function",
          password : "coba function"
      })
      .then(ref => {
        addDoc.push(req.body);
        res.json(addDoc);
        console.log("Data Sukses Di Inputkan", ref.id);
      })
      .catch(err =>{
        console.log("Data Gagal Di Inputkan", err);
      })
  })
};
