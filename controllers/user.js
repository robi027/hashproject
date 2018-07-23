var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const admin = require('firebase-admin');

var serviceAccount = require('../hashproject.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

const userCollection = db.collection('user');

module.exports = function(app){
    app.get('/user', urlencodedParser, function(req, res){
        let allUser = []
        userCollection.get().then(documentSet => {
            documentSet.forEach(doc => {
                allUser.push({
                    "docID" : doc.id,
                    "username" : doc.username,
                    "password" : doc.password
                });
            });
            res.json({
                "statusCode" : "200",
                "statusResponse" : "Ok",
                "message" : "All Users",
                "data" : allUser
            })
        })
        .catch(err => {
            console.log('Error', err);
        })
    })
}



