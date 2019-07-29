const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');
const FormController = require('../controllers/FormController');
const SubmitFormController = require('../controllers/SubmitFormController');
const ValidateFormController = require('../controllers/ValidateFormController');
const AdminController = require('../controllers/AdminController');
const app = express();
const request = require('request');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://hemayat_root:QaS5rtWb2X4wAN2Q@localhost:3306/hemayat', { logging: false});
const rateLimit = require("express-rate-limit");

const smsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 10
});

const uploadPhotoLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 15
});

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 30 // limit each IP to 30 requests per windowMs
});

const adminLevel = (req, res, next) => {
    if(parseInt(req.session.user.level) === 3)
        next();
    else
        res.redirect("/");
};

const supervisionLevel = (req, res, next) => {
    if(parseInt(req.session.user.level) === 3)
        next();
    else {
        // sequelize.query("");
        res.redirect("/");
    }
};

const requestQueueChecker = (req, res, next) => {

    let userId = req.session.user.id;

    return sequelize.query("select r.id from requests r, request_queues rq where r.user_id = " + userId + " and r.id = rq.request_id",
        { type: Sequelize.QueryTypes.SELECT }
    ).then(result2 => {
        if (result2 == null || result2.length === 0)
            next();
        else
            res.redirect("/startRequestError");
    });
};


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop yrsour express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.userId && !req.session && req.session.user) {
        res.clearCookie('userId');
    }
    next();
});

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const sessionCheckerInverse = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};

router.get("/registration", [sessionChecker, supervisionLevel], AdminController.registration );

router.post("/doRegistration", [sessionChecker, supervisionLevel], AdminController.doRegistration );

router.get("/profileFaraynd:reqId", [sessionChecker, supervisionLevel], HomeController.profileFaraynd );

router.get("/instructions", [sessionChecker, adminLevel], AdminController.instructions );

router.get("/kargroh/:name", [sessionChecker, adminLevel], AdminController.kargroh );

router.get("/kargrohs", [sessionChecker, adminLevel], AdminController.kargrohs );

router.get("/deleteKargroh/:name", [sessionChecker, adminLevel], AdminController.deleteKargroh );

router.get("/createNewKargroh", [sessionChecker, adminLevel], AdminController.createNewKargroh );

router.post("/addToKargroh", [sessionChecker, adminLevel], AdminController.addToKargroh );

router.post("/accessOfBlock", [sessionChecker, adminLevel], AdminController.accessOfBlock );

router.post("/deleteMemberFromKargroh", [sessionChecker, adminLevel], AdminController.deleteMemberFromKargroh );

router.post("/updateKargroh", [sessionChecker, adminLevel], AdminController.updateKargroh );

router.get("/blockCreator/:instId/:blockId", [sessionChecker, adminLevel], AdminController.blockCreator );

router.post("/assignStateKargroh", [sessionChecker, adminLevel], AdminController.assignStateKargroh );

router.post("/deleteStateKargroh", [sessionChecker, adminLevel], AdminController.deleteStateKargroh );

router.post("/updateBlock", [sessionChecker, adminLevel], AdminController.updateBlock );

router.get("/analytics", [sessionChecker, adminLevel], AdminController.analytics );

router.post("/getTotalRequests", [sessionChecker, adminLevel], AdminController.getTotalRequests );

router.post("/getTotalDoneRequests", [sessionChecker, adminLevel], AdminController.getTotalDoneRequests );

router.post("/getTotalRequestsPerInstructions", [sessionChecker, adminLevel], AdminController.getTotalRequestsPerInstructions );

router.post("/getTotalVisits", [sessionChecker, adminLevel], AdminController.getTotalVisits );

router.post("/getVisitsPerURL", [sessionChecker, adminLevel], AdminController.getVisitsPerURL );

router.get("/requestsPage", HomeController.requestsPage );

router.get("/adminPage", HomeController.adminPage );

router.get("/setting", sessionChecker, HomeController.setting );

router.get('/', HomeController.retrieve);

// router.get('/tmp',
//     HomeController.readExcel2
//     HomeController.tmp
// );

router.get('/instruction/:id', function(req, res) {
    HomeController.inst(req, res);
});

router.post('/getInstructions', function(req, res) {
    HomeController.getInstructions(req, res);
});

router.post('/getInstructionNames', function(req, res) {
    HomeController.getInstructionNames(req, res);
});

router.post('/getSpecificInstructions', function(req, res) {
    HomeController.getSpecificInstructions(req, res);
});

router.post('/getCities', function(req, res) {
    HomeController.getCities(req, res);
});

router.post('/getCities2', function(req, res) { HomeController.getCities2(req, res); });

router.post('/getStates', function(req, res) {
    HomeController.getStates(req, res);
});

router.get('/home', function(req, res) {
    HomeController.retrieve(req, res)
});

router.get('/investment', function(req, res) {
    res.render('investment', {
        'transferedMode': 2,
        csrfToken: req.csrfToken(),
        login: (req.session && req.session.user)
    });
});

router.get('/employee', function(req, res) {
    res.render('employee', {
        'transferedMode': 1,
        csrfToken: req.csrfToken(),
        login: (req.session && req.session.user)
    });
});

router.get('/integration', function(req, res) {
    res.render('integration', {
        'transferedMode': 4,
        csrfToken: req.csrfToken(),
        login: (req.session && req.session.user)
    });
});

router.get('/nopa', function(req, res) {
    res.render('nopa', {
        'transferedMode': 3,
        csrfToken: req.csrfToken(),
        login: (req.session && req.session.user)
    });
});

router.get("/retrievePassPage1", HomeController.retrievePassPage1 );

router.post("/forget", function(req, res) {

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseError" : "Please select captcha first"});
    }

    const secretKey = "6LewsasUAAAAAKUdOZMH_XQNkmBopQy8j0q5Exem";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function(error,response,body) {

        body = JSON.parse(body);

        if(body.success !== undefined && !body.success) {
            return res.json({"responseError" : "Failed captcha verification"});

        }

        HomeController.forget(req, res);

    });
});

router.post("/changePass", HomeController.changePass);

router.get("/retrievePassPage2/:id/:msg?", HomeController.retrievePassPage2 );

router.post("/submitForgetCode", HomeController.submitForgetCode);

router.get("/retrievePassPage3", HomeController.retrievePassPage3 );

router.get('/logout', function (req, res) {

    if (req.session) {
        req.session.user = null;
        return res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

router.get('/logout2', function (req, res) {

    if (req.session) {
        req.session.user = null;
        return res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

router.get('/loggedIn', function(req, res) {
    res.send("loggedIn");
});

router.get("/login/:msg?", sessionCheckerInverse, function (req, res) {

    let err = req.params.msg;

    res.render('login', {
        'err': err,
        csrfToken: req.csrfToken(),
        my_nonce: req.nonce
    });
});

router.post("/login", smsLimiter, function(req, res) {

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseError" : "Please select captcha first"});
    }

    const secretKey = "6LewsasUAAAAAKUdOZMH_XQNkmBopQy8j0q5Exem";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function(error,response,body) {

        body = JSON.parse(body);

        if(body.success !== undefined && !body.success) {
            return res.json({"responseError" : "Failed captcha verification"});

        }

        HomeController.doLogin(req, res);
    });
});

router.get("/profile", HomeController.profile );

router.get("/news", HomeController.news );

router.get("/termsAndConditions", HomeController.termsAndConditions );

router.get("/startRequestError", HomeController.startRequestError );

router.get("/followCodeError", function (req, res) { res.render('FollowCodeError'); });

router.post("/getMyPlans", HomeController.getMyPlans );

router.get("/contactUs", HomeController.contactUs );

router.get("/complaint", HomeController.complaint );

router.get("/signUp/:msg?", smsLimiter, HomeController.signUp );

router.get("/signUpStep2/:user_id", smsLimiter, HomeController.signUpStep2 );

router.post("/signUp", smsLimiter, function(req, res) {

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseError" : "Please select captcha first"});
    }

    const secretKey = "6LewsasUAAAAAKUdOZMH_XQNkmBopQy8j0q5Exem";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function(error,response,body) {

        body = JSON.parse(body);

        if(body.success !== undefined && !body.success) {
            return res.json({"responseError" : "Failed captcha verification"});

        }

        HomeController.doSignUp(req, res);
    });
});

router.post("/resendActivation", smsLimiter, HomeController.resendActivation );

router.post("/activeProfile", limiter, HomeController.activeProfile );

router.post("/choosePass", HomeController.choosePass );

router.post('/upload_user_file_pre_post/:instId/:mode/:attrId', [sessionChecker, requestQueueChecker, uploadPhotoLimiter], function(req, res) {
    SubmitFormController.uploadUserFilePrePost(req, res);
});

router.post("/finalize/:instId", [sessionChecker, requestQueueChecker, smsLimiter], ValidateFormController.finalize);

router.get("/farayand/:step/:subStep/:instId", [sessionChecker, requestQueueChecker], FormController.farayand );

router.get("/prefarayand/:instId", [sessionChecker, requestQueueChecker], FormController.prefarayand );

router.get("/preactor/:instId", [sessionChecker, requestQueueChecker], FormController.preactor );

router.get("/postcondition/:instId", [sessionChecker, requestQueueChecker], FormController.postcondition );

router.post("/submitPreUserData", [sessionChecker, requestQueueChecker], SubmitFormController.submitPreUserData);

router.post("/submitPostUserData", [sessionChecker, requestQueueChecker], SubmitFormController.submitPostUserData);

router.post("/submitInfoMadrak/:instId/:mode", [sessionChecker, requestQueueChecker], SubmitFormController.submitInfoMadrak);

router.post("/submitInfoMadrak2/:instId/:mode", [sessionChecker, requestQueueChecker], SubmitFormController.submitInfoMadrak2);

router.post("/verifyFollowUpCode", [sessionChecker, requestQueueChecker], FormController.verifyFollowUpCode );

router.post("/getRequestMembers", [sessionChecker, requestQueueChecker], SubmitFormController.getRequestMembers );

router.post("/submitHoghoghiForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitHoghoghiForm );

router.post("/submitHaghighiForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitHaghighiForm );

router.post("/submitSenfForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitSenfForm );

router.post("/getJavazHa", [sessionChecker, requestQueueChecker], SubmitFormController.getJavazHa );

router.post("/submitJavazForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitJavazForm );

router.post("/removeJavazForm", [sessionChecker, requestQueueChecker], SubmitFormController.removeJavazForm );

router.post("/submitModiramelForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitModiramelForm );

router.post("/submitHeyatModireForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitHeyatModireForm );

router.post("/submitNamayandeForm", [sessionChecker, requestQueueChecker], SubmitFormController.submitNamayandeForm );

router.post("/removeHeyatModireForm", [sessionChecker, requestQueueChecker], SubmitFormController.removeHeyatModireForm );

router.get('*', function(req, res){
    res.render("404");
});

module.exports = router;
