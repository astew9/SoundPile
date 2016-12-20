const path = require('path'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    express = require('express'),
    router = require('./../config/routes');


module.exports = (app) => {
    app.set('views', path.join(__dirname, '../views/'));
    app.set('view engine', 'ejs');

    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(cookieParser());
    app.use(session({
      secret: 'secretword',
      resave: false,
      saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', router);
}
