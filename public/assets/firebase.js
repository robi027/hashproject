// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDtC49VwR3RcpWS1dK1amHVC4B4W2O1ym8",
    authDomain: "hashproject-61052.firebaseapp.com",
    databaseURL: "https://hashproject-61052.firebaseio.com",
    projectId: "hashproject-61052",
    storageBucket: "hashproject-61052.appspot.com",
    messagingSenderId: "947403355450"
  };
  firebase.initializeApp(config);
  const db = firebase.firestore();
  db.settings({timestampsInSnapshots: true});