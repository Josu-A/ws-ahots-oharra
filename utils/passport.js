const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
require('dotenv').config();
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['userdata']);

const { myUrl } = require('./config');

passport.use(new GoogleStrategy({
        "clientID" : process.env.GOOGLE_CLIENT_ID,
        "clientSecret" : process.env.GOOGLE_CLIENT_SECRET,
        "callbackURL" : `${myUrl}/auth/google/callback`
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
        "callbackURL" : `${myUrl}/auth/github/callback`,
        "scope" : "user:email"
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

passport.use(new TwitterStrategy({
        "consumerKey" : process.env.TWITTER_CONSUMER_ID,
        "consumerSecret" : process.env.TWITTER_CONSUMER_SECRET,
        "callbackURL" : `${myUrl}/auth/twitter/callback`,
        "includeEmail" : true
    },
    (token, tokenSecret, profile, done) => {
        db.userdata.findOne({ "twitterId" : profile.id }, (error, user) => {
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
                    "twitterId" : profile.id
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
