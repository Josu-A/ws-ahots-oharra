const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['userdata']);

// passport setup
passport.use(new GoogleStrategy({
        "clientID" : process.env.GOOGLE_CLIENT_ID,
        "clientSecret" : process.env.GOOGLE_CLIENT_SECRET,
        "callbackURL" : "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        done(null, profile);
    }
));

// Serialize user
// erabiltzailearen zein datu gorde saioan?
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user
// erabiltzailearen datuak saiotik erauzi
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;