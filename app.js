const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

let sess;
const title = 'MediaPlayerPi';

app.set('views', './views');
app.set('view engine', 'hjs');
app.disable('x-powered-by');

var readSession = function (req, res, next) {
  sess = req.session;
  if (sess.email) sess.showEmail = true;
  console.log(`Email: ${sess.email} Password: ${sess.password}`);
  next();
};

//add some middleware
app.use(session({
  secret: 'sosecret',
  name: 'MediaPlayerPi',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(readSession);

app.listen(3000, function () {
  console.log('MediaPlayerPi listening on port 3000!');
});

app.get('/', function (req, res) {
  if (!sess.email) {
    res.redirect('/login');
  } else {
    res.render('index', {
      title: `${title}`,
      showEmail: sess.showEmail,
      email: `${sess.email}`
    });
  }
});

app.get('/login', function (req, res) {
  if (sess.email) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: `${title}`
    });
  }
});

app.post('/login', (req, res) => {
  sess.email=req.body.email;
  sess.password=req.body.pass;
  res.end('done');
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

app.get('/screensaver', function (req, res) {
  res.render('screensaver', {
    title: `${title}`,
    showEmail: sess.showEmail,
    email: `${sess.email}`
  });
});
