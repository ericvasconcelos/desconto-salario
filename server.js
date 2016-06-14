const express = require('express');

const app = express();

const port = 3000;
const hostname = 'localhost';

app.use(express.static('www'));

app.listen(port, hostname, function() {
  console.log(`Server started! on http://${hostname}/${port}`);
});