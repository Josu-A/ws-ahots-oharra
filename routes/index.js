var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).render('index', {
        "logged" : req.session.userid
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

router.get('/logout', (req, res) => {
    if (req.session.userid) {
        req.session.destroy();
    }
    res.status(302).redirect('/');
});

module.exports = router;
