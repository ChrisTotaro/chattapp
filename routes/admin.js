// Dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Middleware
const authorize = require('../middleware/authenticate');

// Controllers
const user = require('../controllers/user');

// Initialize passport
const initializePassport = require('../config/passport-config');
initializePassport(passport);



// router.get('/', authorize.isAdmin, (req, res) => {
//     res.render('admin/index', {title: 'Admin Dashboard'});
// });
router.get('/', user.getUsers);

router.get('/rooms', (req, res) => {
    res.render('admin/rooms', {title: 'Rooms'});
});


module.exports = router;