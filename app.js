const express = require("express");
const user = require("./controllers/user");
const azure = require("./controllers/azure");
const app = express();

//static file
// app.use(express.static("public"));
app.use("/azure", azure);

//fire controllers
// todoController(app);
user(app);
// azure(app);

// module.exports = app;

//listen to port
app.listen(3000);
console.log("You are listening to port 3000");