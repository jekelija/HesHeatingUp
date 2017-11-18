'use strict';
const express = require('express');
const controller = require('../controllers/onFireController');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

//TODO make this section only hittable by admins
router.post('/updateTeams', controller.updateTeams);
router.post('/updateRosters', controller.updateRosters);
router.post('/updateGames', controller.updateGames);
router.delete('/updateGames', controller.deleteGames);
//END ADMIN SECTION

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;