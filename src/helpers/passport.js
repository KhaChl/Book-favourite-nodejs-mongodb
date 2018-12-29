const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({ email: email });
    if (user) {
        const match = await user.matchpassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, req.flash('error', 'Incorret password'))
        }
    } else {
        return done(null, false, req.flash('error', 'Email not exist'));
    }
}));

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
        return done(null, false, req.flash('error', 'The email is already in use'));
    } else {
        const { name, surname } = req.body;
        const newUser = new User({ email, name, surname, password });
        newUser.password = await newUser.hashpassword(password);
        const save = await newUser.save();
        return done(null, newUser, req.flash('success', 'Successful registration'));
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user);
    });
});
