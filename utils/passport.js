const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github2');
require('dotenv').config();
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['userdata']);

passport.use(new GoogleStrategy({
        "clientID" : process.env.GOOGLE_CLIENT_ID,
        "clientSecret" : process.env.GOOGLE_CLIENT_SECRET,
        "callbackURL" : "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        db.userdata.findOne({ "googleId" : profile.id }, (error, user) => {
            if (error) {
                console.error(error);
                return done(error, undefined);
            }
            if (user) {
                done(null, user);
            }
            else {
                const newUser = {
                    "username" : profile.displayName,
                    "email" : profile.emails[0].value,
                    "googleId" : profile.id
                };
                db.userdata.insert(newUser, (error, user) => {
                    if (error) {
                        console.error(error);
                    }
                    done(error, user);
                });
            }
        });
    }
));

passport.use(new GitHubStrategy({
        "clientID" : process.env.GITHUB_CLIENT_ID,
        "clientSecret" : process.env.GITHUB_CLIENT_SECRET,
        "callbackURL" : "/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        db.userdata.findOne({ "githubId" : profile.id }, (error, user) => {
            if (error) {
                console.error(error);
                return done(error, undefined);
            }
            if (user) {
                done(null, user);
            }
            else {
                const newUser = {
                    "username" : profile.displayName,
                    "email" : profile.emails[0].value,
                    "githubId" : profile.id
                };
                db.userdata.insert(newUser, (error, user) => {
                    if (error) {
                        console.error(error);
                    }
                    done(error, user);
                });
            }
        });
    }
));

passport.serializeUser((user, done) => {
    const userId = user._id.toString();
    done(null, userId);
});

passport.deserializeUser((id, done) => {
    db.userdata.findOne({ "_id" : mongojs.ObjectId(id) }, (error, user) => {
        if (error) {
            console.error(error);
        }
        done(error, user);
    });
});

module.exports = passport;
