const express = require('express');
const route = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../helpers/auth');

route.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

route.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}));

route.get('/register', isNotLoggedIn, (req, res) => {
    res.render('auth/register');
});

route.post('/register', (req, res) => {
    const { email, name, surname, password, confirmpassword } = req.body;
    req.checkBody('email', 'A valid email is required').isEmail();
    req.checkBody('name', 'Name only letters').matches(/^[a-zA-Z]+$/, "i");
    req.checkBody('surname', 'Surname only letters').matches(/^[a-zA-Z]+$/, "i");
    req.checkBody('password', 'Password use 5 or more characters').matches(/^[a-zA-Z0-9]{5,100}$/, "i");
    req.checkBody('password', 'Passwords do not match').equals(confirmpassword);

    const errors = req.validationErrors();
    if (errors) {
        res.render('auth/register', {
            errors: errors,
            email,
            name,
            surname,
        });
    } else {
        passport.authenticate('local.register', {
            successRedirect: '/profile',
            failureRedirect: '/register',
            failureFlash: true
        })(req, res);
    }
});

route.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile');
});

route.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});


module.exports = route;