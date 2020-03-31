const express = require("express");
const redis = require("redis");
const mysql = require("mysql");
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const async = require("async");
const client = redis.createClient();
const app = express();
const router = express.Router();

global.mysql = require('mysql');
global.async = require('async');
global.config = require('./config/app_config.js');
global.db = require('./models/db.js');
global.connectionThreadId = {};

/** Normal manage session */
// app.use(session({
//     secret: 'ssshhhhh',
//     saveUninitialized: true,
//     resave: true
// }));

/** manage session using redis storage */
app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: client,
        ttl: 260
    }),
    saveUninitialized: false,
    resave: false
}));

app.use(function (req, res, next) {
    var allowOrigin = req.headers.origin || "*";
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('./controllers'));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {    
    console.log("=====")
    console.log("Session", req.session);
    // if (req.session.email) {
    //     return res.redirect('/user/admin');
    // }
    //res.sendFile(__dirname + "/views/index.html");

    res.render('index.html');
});

app.get('/home', function (req, res) {
    if (req.session.key) {
        res.render("home.html", {
            email: req.session.key["user_name"]
        });
    } else {
        res.redirect("/");
    }
});

app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});