const express = require('express');
const apps = require('./app');
const app = express();

const port = 3000;

app.use('', apps);

app.listen(port, (err) => {

  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
