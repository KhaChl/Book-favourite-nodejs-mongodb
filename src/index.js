const express = require('express');
const path = require('path');
const template = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const morgan = require('morgan');
const validator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');

// Initialization
const app = express();
require('./database');
require('./helpers/passport');


// Settings
app.set('port', process.env.Port || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', template({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers/timeago')
}));
app.set('view engine', '.hbs');

// Middelwares
app.use(session({
    secret: 'bookmongodbsession',
    resave: true,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(validator());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/books', require('./routes/books'));


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Error 400
app.use((req, res) => {
    res.status(400);
    res.render('error', { title: '404: File Not Found' });
})

// Error 500
app.use((error, req, res, next) => {
    res.status(500);
    res.render('error', { title: '500: Internal Server Error' });
})

// Server listening
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});