/*
  Filename: index.js
  Author: Franco Chong
  Website Name: Franco's Portfolio
  Description: the routing for the pages
*/

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>{
  res.render('content/index', { title: 'Home' });
});

/* GET about page. */
router.get('/about', (req, res, next) =>{
  res.render('content/about', { title: 'About' });
});

/* GET projects page. */
router.get('/projects', (req, res, next) =>{
  res.render('content/projects', { title: 'Projects' });
});

/* GET services page. */
router.get('/services', (req, res, next) =>{
  res.render('content/services', { title: 'Services' });
});

/* GET contact page. */
router.get('/contact', (req, res, next) =>{
  res.render('content/contact', { title: 'Contact' });
});

module.exports = router;
