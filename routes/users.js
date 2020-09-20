var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
  .then((user) => {
    if (user != null) {
      let err = new Error(`User ${req.body.username} already exists!`);
      err.status = 403;
      return next(err);
    }

    return User.create({
      username: req.body.username,
      password: req.body.password // Vulnerable, should store encrypted password instead
    });
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      let err = new Error('You are not authenticated!');
  
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    let Auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
    let username = Auth[0], password = Auth[1];
    
    User.findOne({ username: username })
    .then((user) => {
      if (user == null) {
        let err = new Error(`User ${username} doesn't exist!`);
    
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
      } else if (user.password !== password) {
        let err = new Error(`Incorrect password!`);
    
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
      } else if (authHeader.split(' ')[0] === 'Basic' && username === user.username && password === user.password) {
        // res.cookie('user', 'admin', { signed: true, expires: new Date(Date.now() + 900000) });
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      } else {
        let err = new Error('You are not authenticated!');
    
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    })
    .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        req.session = null;
        res.clearCookie('session-id');
        res.redirect('/');
      }
    });
  } else {
    let err = new Error('You are not logged in!');
    
    err.status = 403;
    return next(err);
  }
});

module.exports = router;
