//configure firestore
const admin = require("firebase-admin");
var serviceAccount = require("./hashprojectfs.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

module.exports = db;