'use strict';
var express = require('express');
var router = express.Router();

router.post('/login', (req, res) => {
    req.session.email = req.body.email;
    res.end('done');
});

router.get('/admin', (req, res) => {
    console.log(req.session);
    if (req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href=' + '/user/logout' + '>Logout</a>');
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href=' + '/' + '>Login</a>');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

module.exports = router;