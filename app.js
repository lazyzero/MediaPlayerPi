const express = require('express');
const app = express();

app.use(express.static('static'));

app.listen(3000, function () {
  console.log('MediaPlayerPi listening on port 3000!');
});

app.get('/', (res, req) => {
  res.send('Hello World!');
});
