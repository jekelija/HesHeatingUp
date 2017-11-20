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
    const data = { user : req.user };
    console.log(data);
    res.render('index', data);
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

router.post('/login', passport.authenticate('local-login'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.post('/user/player', isLoggedIn, function(req, res) {
    console.log('user: ' + req.user);
    console.log('body: ' + req.body);
    controller.addUserPlayer(req.user, req.body.playerId)
    .then(()=> {
        res.redirect('/');
    });
});

module.exports = router;