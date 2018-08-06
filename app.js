const express = require("express");
// const todoController = require('./controllers/todoController');
const user = require("./controllers/user");
const azure = require("./controllers/azure");
const app = express();


//set up template engine
//app.set("view engine", "ejs");

//static file
// app.use(express.static("public"));

//fire controllers
// todoController(app);
//user(app);
//azure(app);
app.use('/api', require('./controllers/azure'));

//listen to port
app.listen(3000);
console.log("You are listening to port 3000");

//module.exports = app;