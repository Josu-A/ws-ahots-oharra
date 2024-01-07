const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['userdata']);

passport.use(new GoogleStrategy({
        "clientID" : process.env.GOOGLE_CLIENT_ID,
        "clientSecret" : process.env.GOOGLE_CLIENT_SECRET,
        "callbackURL" : "https://ws.aguijos.eus/auth/google/callback"
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
        "callbackURL" : "https://ws.aguijos.eus/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)
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
                    "username" : profile.username,
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
