const passport = require('passport');
const mongoose = require('mongoose');
const Account = require('../models/Account');
const LocalStrategy = require('passport-local').Strategy;

module.exports =  (app) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Account.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
    (username, password, done) => {
        Account.findOne({username:username}, function(err,results) {
                if(err) {
                    return done(err);
                }
                if(!results) {
                    return done("No such user", false);
                }
                else if(!results.validPassword(password)) {
                    return done("Wrong password", false);
                } else {
                    return done(null, results);
                }
            });
    }));
}
