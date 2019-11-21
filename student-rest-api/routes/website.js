const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');

const CONFIG = require('../config/config');
const CryptoJS = require("crypto-js");

const DashboardController = require('../controllers/V1/WebSite/Dashboard.controller');
const AuthenticationController = require('../controllers/V1/WebSite/Authentication.controller');
const AboutPrivacyController = require('../controllers/V1/Institute/privacyAndAbout.controller');
const StudentAuthenticationController = require('../controllers/V1/Student/Authentication.controller');

require('./../middleware/passport')(passport)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ status: true, message: "This is Company Rest api.", data: { "version_number": "v1.0.0" } })
});

const optionalJwt = function (req, res, next) {
    if (req.headers['authorization']) {
        return passport.authenticate('website', { session: false })(req, res, next);
    }
    return next();
};

const decryptPayload = function (req, res, next) {

    if (req.fields.data) {
        try {

            var bytes = CryptoJS.AES.decrypt(req.fields.data, CONFIG.WEBSITE_ENCRYPTION_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            req.fields = decryptedData;

        } catch (e) {
            req.fields = {};
        }
    } else {
        req.fields = {};
    }
    next()
}

router.post('/enc', AuthenticationController.encryptData);

router.get('/home', optionalJwt, DashboardController.dashBordDetail);

router.post('/login', decryptPayload, optionalJwt, AuthenticationController.login);

router.get('/about', optionalJwt, AboutPrivacyController.getAboutUs);

router.post('/purchase', decryptPayload, optionalJwt, DashboardController.addPurchase);
router.post('/checkCoupon', decryptPayload, optionalJwt, DashboardController.verifyCouponcode);
router.post('/stripePurchase',decryptPayload, optionalJwt, DashboardController.addStripePurchase);

router.get('/contact', optionalJwt, DashboardController.getAccountDetailAndBranches);
router.get('/privacyPolicy', optionalJwt, DashboardController.getPrivacyPolicy);

router.post('/sendOTP', decryptPayload, AuthenticationController.sendOTPForRegistration);
router.post('/verifyOTP', decryptPayload, AuthenticationController.verifyUserOTP);
router.post('/signup', decryptPayload, optionalJwt, AuthenticationController.registerStudent);
router.post('/setBranch', decryptPayload, optionalJwt, AuthenticationController.registerStudentBranch);

module.exports = router;