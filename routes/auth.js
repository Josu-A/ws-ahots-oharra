const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google',{
    "scope" : ["profile", "email"]
}));

router.get('/google/callback', passport.authenticate('google', { "failureRedirect" : "/login" }),
    (req, res) => {
        req.session.userid = req.user._id.toString();
        req.session.username = req.user.username;
        res.status(200).redirect('/');
    }
 );

router.get('/github', passport.authenticate('github', {
        "scope" : ["user:email"]
}));

router.get('/github/callback', passport.authenticate('github', { "failureRedirect" : "/login" }),
    (req, res) => {
        req.session.userid = req.user._id.toString();
        req.session.username = req.user.username;
        res.status(200).redirect('/');
    }
);

module.exports = router;
