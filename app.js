const express = require("express");
// const todoController = require('./controllers/todoController');
const user = require("./controllers/user");
const app = express();


//set up template engine
//app.set("view engine", "ejs");

//static file
// app.use(express.static("public"));

//fire controllers
// todoController(app);
user(app);

//listen to port
app.listen(3000);
console.log("You are listening to port 3000");
