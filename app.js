const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('./controllers'));

app.get('/', (req, res) => {    
    console.log("=====")
    console.log("Session", req.session);
    if (req.session.email) {
        return res.redirect('/user/admin');
    }
    res.sendFile(__dirname + "/views/index.html");
});

app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});