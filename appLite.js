const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();

//config.file({ file: 'config/config.json' });
let config = {
  "title": "MediaPlayerPi"
}

const title = config.title;

app.set('views', './views');
app.set('view engine', 'hjs');
app.disable('x-powered-by');

app.use(express.static('upload'));

app.listen(3000, function () {
  console.log(`${title} listening on port 3000!`);
});

app.get('/screen', function (req, res) {
  let logo = "logo.jpg";

  if (fs.existsSync(path.join(__dirname, "upload"))) {
    if (fs.existsSync(path.join(__dirname, "upload/logo.png"))) {
      logo = "logo.png";
    }
  }
  res.render('screen', {
    title: `${title}`,
    logo: `${logo}`
  });
});
