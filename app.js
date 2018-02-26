const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
var bcrypt = require('bcrypt');
var config = require('nconf');
config.file({ file: 'config/config.json' });

const saltRounds = 10;

let sess;
const title = config.get('title');

app.set('views', './views');
app.set('view engine', 'hjs');
app.disable('x-powered-by');

if (!config.get('admin:password')) {
  bcrypt.hash('admin', saltRounds, function(err, hash) {
    console.log(hash);
  });
}

//load the content array
let content = config.get('content');

var readSession = function (req, res, next) {
  sess = req.session;
  if (sess.user) {
    sess.showUser = true;
  } else {
    if (req.path !== '/login' && req.path !== '/screen') {
      return res.redirect('/login');
    }
  }
  console.log(`User: ${sess.user} Password: ${sess.password}`);
  next();
};

//add some middleware

app.use(express.static('static'));
app.use(express.static('upload'));
app.use(session({
  secret: 'sosecret',
  name: `${title}`,
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(readSession);

app.listen(3000, function () {
  console.log(`${title} listening on port 3000!`);
});

app.get('/', function (req, res) {
  res.redirect('/admin');
});

app.get ('/admin', (req, res) => {
  res.render('admin', {
    title: `${title}`,
    showUser: sess.showUser,
    user: `${sess.user}`
  });
});

app.get('/login', function (req, res) {
  if (sess.user) {
    res.redirect('/admin');
  } else {
    res.render('login', {
      title: `${title}`
    });
  }
});

app.post('/login', (req, res) => {
  console.log('check password');
  if (req.body.user === config.get('admin:user')) {
    let hash = config.get('admin:password');
    bcrypt.compare(req.body.pass, hash, function(err, resp) {
      if (resp === true) {
        console.log('password correct');
        sess.user=req.body.user;
        sess.password=req.body.pass;
        res.end('done');
      } else {
        res.end('wrong password');
        console.log('password wrong');
      }
    });
  } else {
    res.end('wrong user');
    console.log('username wrong');
  }

});

app.get('/logout', (req,res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
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
    logo: `${logo}`,
    showUser: sess.showUser,
    user: `${sess.user}`
  });
});

function saveConfig() {
  config.save(function (err) {
    fs.readFile('config/config.json', function (err, data) {
      console.dir(JSON.parse(data.toString()))
    });
  });
}
