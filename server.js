const express = require('express');
const apps = require('./app');
const app = express();

const port = process.env.port || 3000;

app.use('', apps);

// app.get('/coba', (req, res)=> {
// 	console.log("Hello");
// 	res.send("OK");
// });

// setInterval(()=> {
// 	console.log("hello " + Date.now());
// }, 3000);

app.listen(port, (err) => {

  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
