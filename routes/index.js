/*
  Filename: index.js
  Author: Franco Chong
  Website Name: Franco's Portfolio
  Description: the routing for the pages
*/

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//define the user models
let UserModel = require('../models/users');
let User = UserModel.User; //alias for user model object

// define the contacts model
let buscontact = require('../models/contacts');

//create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  //checks if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET about page. */
router.get('/about', (req, res, next) => {
  res.render('content/about', {
    title: 'About',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET projects page. */
router.get('/projects', (req, res, next) => {
  res.render('content/projects', {
    title: 'Projects',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET services page. */
router.get('/services', (req, res, next) => {
  res.render('content/services', {
    title: 'Services',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    displayName: req.user ? req.user.displayName : ''
  });
});

//GET /login - render the login view
router.get('/login', (req, res, next) => {
  //check to see if the user is not already logged in
  if (!req.user) {
    //render the login page
    res.render('auth/login', {
      title: "Login",
      contacts: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/contacts'); //redirect to contacts list
  }
});

//POST /login - process the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/contacts',
  failureRedirect: '/login',
  failureFlash: 'Incorrect Username / Password'
}));

//GET /register - render the registration view
router.get('/register', (req, res, next) => {
  //check to see if the user is not already logged in
  if (!req.user) {
    //render the register page
    res.render('auth/register', {
      title: "Register",
      contacts: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/contacts'); //redirect to contacts list
  }
});

//POST /register - process the registration submission
router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      displayName: req.body.displayName
    }),
    req.body.password,
    (err) => {
      if (err) {
        console.log('Error inserting new user');
        if (err.name == "UserExistsError") {
          req.flash('registerMessage', 'Registration Error: User Already Exists');
        }
        return res.render('auth/register', {
          title: "Register",
          books: '',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      //if registration is successful
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/contacts');
      });
    });
});

//GET /logout - process the logout request
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');//redirect to the home page
});

module.exports = router;
