// Dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Controllers
const user = require('../controllers/user');

// Middleware
const authorize = require('../middleware/authenticate');

// Initialize passport
const initializePassport = require('../config/passport-config');
initializePassport(passport);


// GET requests
router.get('/', authorize.checkAuthenicated, (req, res) => {
  res.render('index', { title: 'Home', user_name: req.user.username });
});

router.get('/login', authorize.checkNotAuthenicated, (req, res) => {
  res.render('login', { title: 'Login'});
});

router.get('/register', authorize.checkNotAuthenicated, (req, res) => {
  res.render('register', { title: 'Sign Up'});
});

//router.get('/chat', checkAuthenicated, user.connectUserToSocket);
router.get('/chat', authorize.checkAuthenicated, (req, res) => {
  res.render('chat', { title: 'Chat Room', username: req.user.username});
});


// router.get('/admin', authorize.isAdmin, (req, res) => {
//   res.render('admin/index');
// });


// POST requests
router.post('/login', authorize.checkNotAuthenicated, passport.authenticate('local', {
  /* CHANGE THIS*/
  //successRedirect: '/',
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/register', authorize.checkNotAuthenicated, user.createUser);



// DELETE requests
router.delete('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    return res.redirect('/login');
  });
});


// Export the router
module.exports = router;
