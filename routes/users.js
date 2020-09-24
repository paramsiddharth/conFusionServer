var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), 
  req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    } else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration successful!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You have successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    res.clearCookie('session-id');
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        req.session = null;
        // req.logout();
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
