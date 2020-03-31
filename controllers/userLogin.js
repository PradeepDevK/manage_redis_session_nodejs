'use strict';
let express = require('express');
let router = express.Router();
let UserLoginModel = require('../models/UserLogin');

router.post('/login', (req, res) => {
    // req.session.email = req.body.email;
    // res.end('done');

    let UserLoginModelObject = new UserLoginModel( req.session);
    UserLoginModelObject.validatePassWord(req.body, (response) => {
        if (response === null) {
            return res.json({
                "error": "true",
                "message": "Database error occured"
            });
        } else {
            if (!response) {
                return res.json({
                    "error": "true",
                    "message": "Login failed ! Please register"
                });
            } else {
                req.session.key = response;
                return res.json({
                    "error": false,
                    "message": "Login success."
                });
            }
        }
    });
});


router.post("/register", function (req, res) {
    let UserLoginModelObject = new UserLoginModel(req.session);
    global.async.waterfall([
        //check email exists or not
        function(callback) {
            UserLoginModelObject.checkEmail(req.body, (response) => {
                if (response === null) {
                    return callback("This email is already present");
                }
                callback(null);
            });
        },
        function (callback) {
            UserLoginModelObject.register(req.body, (response) => {
                if (response === null) {
                    return callback("Error while adding user.");
                }
                callback(null, "Registered successfully.")
            });
        }
    ], (err, result) => {
        if (err) {
            res.json({"error" : true , "message" : err});
        } else {
            res.json({"error" : false , "message" : result});
        }
    })
});

router.get("/fetchStatus", function (req, res) {
    if (req.session.key) {
        let UserLoginModelObject = new UserLoginModel(req.session);
        UserLoginModelObject.fetchStatus(req.body, (response) => {
            if(!response) {
                res.json({"error" : false, "message" : "There is no status to show."});
            } else {
                res.json({"error" : false, "message" : response});
            }
        });
    } else {
        res.json({"error" : true, "message" : "Please login first."});
    }
});

router.post("/addStatus", function (req, res) { 
    if (req.session.key) {
        let UserLoginModelObject = new UserLoginModel(req.session);
        UserLoginModelObject.addStatus(req.body, (response) => {
            if(!response) {
            res.json({"error" : false, "message" : "Status is added."});
            } else {
            res.json({"error" : false, "message" : "Error while adding Status"});
            }
        });
    } else {
        res.json({"error" : false, "message" : "Error while adding Status"});
    }
});

// router.get('/admin', (req, res) => {
//     console.log(req.session);
//     if (req.session.email) {
//         res.write(`<h1>Hello ${req.session.email} </h1><br>`);
//         res.end('<a href=' + '/user/logout' + '>Logout</a>');
//     } else {
//         res.write('<h1>Please login first.</h1>');
//         res.end('<a href=' + '/' + '>Login</a>');
//     }
// });

router.get('/logout', (req, res) => {
    // req.session.destroy((err) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     res.redirect('/');
    // });

    if(req.session.key) {
    req.session.destroy(function(){
      res.redirect('/');
    });
    } else {
        res.redirect('/');
    }
});

module.exports = router;