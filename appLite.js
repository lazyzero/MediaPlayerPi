const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const finder = require('fs-finder');
const app = express();

const sleep = require('sleep');

let config = fs.readJsonSync('config/config.json');
// let config = {
//   "title": "MediaPlayerPi"
// }


const title = config.title;

var mediaFiles = finder.in(path.join(__dirname, 'upload')).findFiles('*.<mp4|mkv>');
let mediaIndex = -1;
console.log(mediaFiles);

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

//wait 3 seconds after server started, then start playback
setTimeout(playNext(), 3000);

function playNext() {
  mediaIndex++;
  if (mediaIndex >= mediaFiles.length) {
    mediaIndex = 0;
  }
  console.log(mediaFiles[mediaIndex]);
  sleep.sleep(3);
  playNext();
}
