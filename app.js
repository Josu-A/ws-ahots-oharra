const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();

const passport = require('./utils/passport');
const cleanup = require('./utils/cleanup');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();

// remove old audios
setInterval(cleanup, 60 * 60 * 1000);

// session storage setup
const store = new MongoDBStore({
        "uri" : "mongodb://localhost:27017/grabaketak",
        "collection": "storedSessions"
    },
    error => {
        if (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }
);
store.on('error', error => {
    console.error('MongoDBStore error:', error);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ "extended" : false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    "secret" : process.env.SESSION_SECRET,
    "resave" : false,
    "saveUninitialized" : false,
    "cookie" : {
        "maxAge" : 30 * 60 * 1000
    },
    "store" : store
}));
app.use(passport.initialize());
app.use(passport.session());

// routes setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
