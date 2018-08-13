const express = require("express");
const server = require("./server");
const user = require("./controllers/user");
const azure = require("./controllers/azure");
const axios = require("./controllers/axiosTest");
const app = express();

//static file
app.use(express.static(__dirname + '/views'));
app.use("/azure", azure);
app.use("/axios", axios);
//fire controllers
// todoController(app);
user(app);
// azure(app);
server(app);

//listen to port
// app.listen(3000);
// console.log("You are listening to port 3000");