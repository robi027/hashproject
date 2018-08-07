const express = require("express");
// const todoController = require('./controllers/todoController');
const user = require("./controllers/user");
const azure = require("./controllers/azure");
const axios = require("./controllers/axiosTest");
const app = express();

//set up template engine
//app.set("view engine", "ejs");

//static file
// app.use(express.static("public"));
app.use("/azure", azure);
app.use("/axios", axios);
//fire controllers
// todoController(app);
user(app);
// azure(app);

// module.exports = app;

//listen to port
app.listen(3000);
console.log("You are listening to port 3000");