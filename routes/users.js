const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('grabaketak', ['userdata']);
const bcrypt = require('bcrypt');
const { validateLoginFields, validateRegisterFields } = require('../utils/formValidation');

const isUserLogged = req => {
    return req.session.userid != null;
};

router.get('/check-login-status', (req, res) => {
    if (req.session.userid) {
        res.status(200).json({
            "status" : "success",
            "message" : "User is logged in",
            "userid" : req.session.userid
        });
    }
    else {
        res.status(401).json({
            "status" : "error",
            "message" : "User is not logged in"
        });
    }
});

router.post('/login', (req, res) => {
    if (isUserLogged(req)) {
        return res.status(400).json({
            "status" : "error",
            "message" : "User is already logged in."
        });
    }

    const validatedLogin = validateLoginFields(req.body);
    if (validatedLogin.status == "error") {
        return res.status(400).json(validatedLogin);
    }

    let authenticatedUser = null;
    let { username, password } = req.body;

    db.userdata.findOne({ "username" : username }, async (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                "status" : "error",
                "message" : "Internal Server Error"
            });
        }
        if (user) {
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (passwordMatches) {
                authenticatedUser = user;
            }
        }
        if (!authenticatedUser) {
            return res.status(401).json({
                "status" : "error",
                "message" : "Failed login attempt"
            });
        }
        req.session.userid = authenticatedUser.username;
        console.log(req.session);
        res.status(200).json({
            "status" : "success",
            "message" : "Logged in successfully."
        });
    });
});

router.post('/register', (req, res, next) => {
    if (isUserLogged(req)) {
        return res.status(400).json({
            "status" : "error",
            "message" : "User is already registered."
        });
    }

    const validatedRegister = validateRegisterFields(req.body);
    if (validatedRegister.status == "error") {
        return res.status(400).json(validatedRegister);
    }

    let authenticatedUser = null;
    const { username, password, email } = req.body;

    db.userdata.findOne({ "$or" : [{ "username" : username }, { "email" : email }] }, async (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                "status" : "error",
                "message" : "Internal Server Error"
            });
        }
        if (user && user.username == username) {
            console.warn(`User ${user.username} already exists.`);
            return res.status(409).json({
                "status" : "error",
                "message" : `User ${user.username} already exists.`
            });
        }
        if (user && user.email === email){
            console.warn(`A user is already registered with that email (${email}).`);
            return res.status(409).json({
                "status" : "error",
                "message" : 'A user is already registered with that email.'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            "username" : username,
            "password" : hashedPassword,
            "email" : email
        };

        db.userdata.insert(newUser, (error, userData) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    "status" : "error",
                    "message" : "Internal Server Error"
                });
            }
            console.log('New DB entry:', userData);
            authenticatedUser = userData;

            if (!authenticatedUser) {
                return res.status(400).json({
                    "status" : "error",
                    "message" : "Something went wrong."
                });
            }
            req.session.userid = authenticatedUser.username;
            console.log(req.session);
            res.status(200).json({
                "status" : "success",
                "message" : "Registered successfully."
            });
        });
    });
});

module.exports = router;
