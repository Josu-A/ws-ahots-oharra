const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.status(200).render('index', {
        "logged" : req.session.username
    });
});

router.get('/login', (req, res) => {
    if (req.session.userid) {
        return res.status(302).redirect('/');
    }
    res.status(200).render('login');
});

router.get('/register', (req, res) => {
    if (req.session.userid) {
        return res.status(302).redirect('/');
    }
    res.status(200).render('register');
});

router.get('/logout', (req, res, next) => {
    if (req.session.passport) {
        req.logout(error => {
            if (error) {
                return next(error);
            }
            req.session.destroy();
            res.status(302).redirect('/');
        });
    }
    else {
        if (req.session.userid) {
            req.session.destroy();
        }
        res.status(302).redirect('/');
    }
});

router.get('/privacy', (req, res) => {
    res.status(200).render('privacy');
});

module.exports = router;
