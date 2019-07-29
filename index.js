const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const redisSession = require('node-redis-session');
const helmet = require('helmet');
const nocache = require('nocache');
const csrf = require('csurf');
const Sequelize = require('sequelize');
const Common = require("./controllers/Common");
const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});

app.use(nocache());

app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));

app.use(function(req, res, next) {
    req.nonce = "2726c7f26c";
    res.setHeader("Content-Security-Policy",
        "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-" + req.nonce + "' https://www.google.com/recaptcha/api.js 'unsafe-eval'; img-src 'self' www.gstatic.com; frame-src www.google.com; object-src 'none'; base-uri 'none';");
    return next();
});

app.use(cookieParser());
app.use(redisSession({'cookieOptions': {'secure': false}}));

app.set('view engine', 'pug');
app.set('views','./views');
app.use("/assets", express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const router = require('./routers/router.js');
app.use(csrf());
app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
});

app.use((req, res, next) => {

    if(req.method === "GET") {

        let today = Common.getFormattedToday();

        let tmp = req.url.split("/");
        if(tmp.length > 1 && (tmp[1] === "assets" || tmp[1] === "favicon.ico")) {
            next();
            return;
        }

        sequelize.query("update statistics set counter = counter + 1 where url = ? and date = ?", {
            type: Sequelize.QueryTypes.UPDATE,
            replacements: [req.url, today]
        }).then(t => {
            if (t[1] === 0) {
                sequelize.query("insert into statistics (url, counter, date) values (?, ?, ?)", {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: [req.url, 1, today]
                });
            }
        });
    }

    next();
});


app.use('/', router);

app.use((err, req, res, next) => {
    if (err) {
        return res.sendStatus(500);
    }
    next();
});

app.listen(3000);
