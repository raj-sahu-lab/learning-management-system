const { ExtractJwt, Strategy } = require('passport-jwt');
const { TOA_account, TOA_Admin, TOA_student, TOA_branch, TOA_plan_purchase, TOA_city, TOA_country , TOA_student_institute_relationship, TOA_login_device } = require('../models');
const CONFIG = require('../config/config');
const { to } = require('../services/V1/util.service');
const CryptoJS = require("crypto-js");
const tutorService = require('../services/V1/Institute/tutor.service');
const authInstituteService = require('../services/V1/Institute/auth.service');
module.exports = function (passport) {

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;
    opts.passReqToCallback = true

    passport.use(new Strategy(opts, async function (req, jwt_payload, done) {

        let exp = new Date(jwt_payload.exp * 1000);
        let currentTime = new Date();
        let diferenceOfDate = exp.getTime() - currentTime.getTime();

        if (diferenceOfDate < 0)
            return done(null, false);

        if (jwt_payload.token && req.headers.device_id) {

            let token = jwt_payload.token;
            var bytes = CryptoJS.AES.decrypt(token, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if(decryptedData.accountId){
                [err, deviceIds] = await to(TOA_login_device.findAll({ where: { typeId :  decryptedData.accountId} }));
                if (err) return done(err, false);
            }
            if(decryptedData.user_id){
                [err, deviceIds] = await to(TOA_login_device.findAll({ where: { typeId :  decryptedData.user_id} }));
                if (err) return done(err, false);
            }

            if(deviceIds){
                for(let i=0; i<deviceIds.length; i++){
                    if(req.headers.device_id == deviceIds[i].webDeviceId){
                        if (decryptedData.userType == 3) {

                            [err, tutor] = await to(tutorService.getTutor(decryptedData.accountId, decryptedData.id));

                            if (err) return done(err, false);
                            if (tutor) {

                                var tutorJSON = tutor.toJSON();
                                tutorJSON.userType = 3;
                                tutorJSON.account_id = tutorJSON.branch.account.id;
                                return done(null, tutorJSON);
                            } else {
                                return done(err, false);
                            }

                        } else if (decryptedData.userType == 2) {

                            [err, user] = await to(TOA_account.findByPk(decryptedData.user_id));
                            if (err) return done(err, false);

                            [err, branch] = await to(TOA_branch.findByPk(decryptedData.branch_id));
                            if (err) return done(err, false);

                            if (user && branch) {

                                if (user.delete == 0 && branch.delete == 0)
                                    if (user.account_id == branch.account_id) {

                                        user.branch = branch;
                                        return done(null, user);

                                    } else {

                                        return done(null, false);
                                    }
                                else
                                    return done(null, false);
                            } else {
                                return done(null, false);
                            }

                        } else {

                            [err, user] = await to(TOA_account.findByPk(decryptedData.user_id));

                            if (err) return done(err, false);
                            if (user != null) {

                                var userEdit = user.toJSON();

                                if (user.delete == 0) {

                                    if (req.route.path == "/user/termsAndPlan" || req.route.path == "/user/checkOffer" || req.route.path == "/user/purchasePlan") {

                                        return done(null, user);

                                    } else {

                                        [err, purchasesPlan] = await to(authInstituteService.checkPlan(user.account_id));
                                        if (purchasesPlan) {

                                            let planEndDate = new Date(purchasesPlan.toJSON().endDate);
                                            let currentDate = new Date();

                                            if (currentDate > planEndDate) {

                                                return done(null, false);

                                            } else {

                                                userEdit.currentPlan = purchasesPlan;
                                                userEdit.userType = 1;
                                                return done(null, userEdit);
                                            }
                                        } else {
                                            return done(null, false);
                                        }
                                    }

                                } else {

                                    return done(null, false);
                                }
                            } else {
                                return done(null, false);
                            }

                        }
                    }
                }
                
                return done(err, false);
            }

            

        } else {
            return done(null, false);
        }

    }));

    passport.use('withoutDeviceInstitute', new Strategy(opts, async function (req, jwt_payload, done) {

        let exp = new Date(jwt_payload.exp * 1000);
        let currentTime = new Date();
        let diferenceOfDate = exp.getTime() - currentTime.getTime();

        if (diferenceOfDate < 0)
            return done(null, false);

        if (jwt_payload.token) {

            let token = jwt_payload.token;
            var bytes = CryptoJS.AES.decrypt(token, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if(decryptedData.accountId){
                [err, deviceIds] = await to(TOA_login_device.findAll({ where: { typeId :  decryptedData.accountId} }));
                if (err) return done(err, false);
            }
            if(decryptedData.user_id){
                [err, deviceIds] = await to(TOA_login_device.findAll({ where: { typeId :  decryptedData.user_id} }));
                if (err) return done(err, false);
            }

            if (decryptedData.userType == 3) {

                [err, tutor] = await to(tutorService.getTutor(decryptedData.accountId, decryptedData.id));

                if (err) return done(err, false);
                if (tutor) {

                    var tutorJSON = tutor.toJSON();
                    tutorJSON.userType = 3;
                    tutorJSON.account_id = tutorJSON.branch.account.id;
                    return done(null, tutorJSON);
                } else {
                    return done(err, false);
                }

            } else if (decryptedData.userType == 2) {

                [err, user] = await to(TOA_account.findByPk(decryptedData.user_id));
                if (err) return done(err, false);

                [err, branch] = await to(TOA_branch.findByPk(decryptedData.branch_id));
                if (err) return done(err, false);

                if (user && branch) {

                    if (user.delete == 0 && branch.delete == 0)
                        if (user.account_id == branch.account_id) {

                            user.branch = branch;
                            return done(null, user);

                        } else {

                            return done(null, false);
                        }
                    else
                        return done(null, false);
                } else {
                    return done(null, false);
                }

            } else {

                [err, user] = await to(TOA_account.findByPk(decryptedData.user_id));

                if (err) return done(err, false);
                if (user != null) {

                    var userEdit = user.toJSON();

                    if (user.delete == 0) {

                        if (req.route.path == "/user/termsAndPlan" || req.route.path == "/user/checkOffer" || req.route.path == "/user/purchasePlan") {

                            return done(null, user);

                        } else {

                            [err, purchasesPlan] = await to(authInstituteService.checkPlan(user.account_id));
                            if (purchasesPlan) {

                                let planEndDate = new Date(purchasesPlan.toJSON().endDate);
                                let currentDate = new Date();

                                if (currentDate > planEndDate) {

                                    return done(null, false);

                                } else {

                                    userEdit.currentPlan = purchasesPlan;
                                    userEdit.userType = 1;
                                    return done(null, userEdit);
                                }
                            } else {
                                return done(null, false);
                            }
                        }

                    } else {

                        return done(null, false);
                    }
                } else {
                    return done(null, false);
                }

            }

            

        } else {
            return done(null, false);
        }

    }));

    passport.use('admin', new Strategy(opts, async function (req, jwt_payload, done) {

        let exp = new Date(jwt_payload.exp * 1000);
        let currentTime = new Date();
        let diferenceOfDate = exp.getTime() - currentTime.getTime();

        if (diferenceOfDate < 0)
            return done(null, false);

        if (jwt_payload.token) {

            let token = jwt_payload.token;
            var bytes = CryptoJS.AES.decrypt(token, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            let err, user;

            [err, user] = await to(TOA_Admin.findByPk(decryptedData.id));

            if (err) return done(err, false);
            if (user) {
                if (user.delete == 0)
                    return done(null, user);
                else
                    return done(null, false);
            } else {
                return done(null, false);
            }
        } else {
            return done(null, false);
        }
    }));

    passport.use('student', new Strategy(opts, async function (req, jwt_payload, done) {


        let exp = new Date(jwt_payload.exp * 1000);
        let currentTime = new Date();
        let diferenceOfDate = exp.getTime() - currentTime.getTime();

        if (diferenceOfDate < 0)
            return done(null, false);

        if (jwt_payload.token && req.headers.device_id) {

            let token = jwt_payload.token;
            var bytes = CryptoJS.AES.decrypt(token, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


            let err, user;

            [err, user] = await to(TOA_student.findByPk(decryptedData.id, {
                where: { status: 0, delete: 0 },
                include: [
                    {
                        model: TOA_student_institute_relationship,
                        as: 'instituteList',
                        required: false,
                        attributes: ['branch_id', 'isActive'],
                    },
                    {
                        model: TOA_branch,
                        as: 'branch',
                        required: false,
                        attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'name']],
                        include: [
                            {
                                model: TOA_account,
                                as: 'account',
                                where: { status: 0, delete: 0 },
                                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'notificationToken'],
                            }
                        ]
                    }
                ]
            }));

            if (err) return done(err, false);
            if (user) {

                if (user.instituteList != null && user.instituteList.isActive == 0) {

                    return done(null, false);

                } else if (user.delete == 0 && (user.webDeviceId == req.headers.device_id && req.headers.devicetype == 3)) {

                    return done(null, user);

                } else if (user.delete == 0 && (user.androidDeviceId == req.headers.device_id && (req.headers.devicetype == 1 || req.headers.devicetype == 2))) {

                    return done(null, user);
                }
                else
                    return done(null, false);

            } else {
                return done(null, false);
            }
        } else {
            return done(null, false);
        }
    }));

    passport.use('website', new Strategy(opts, async function (req, jwt_payload, done) {

        let exp = new Date(jwt_payload.exp * 1000);
        let currentTime = new Date();
        let diferenceOfDate = exp.getTime() - currentTime.getTime();

        if (diferenceOfDate < 0)
            return done(null, false);


        if (jwt_payload.token) {

            let token = jwt_payload.token;
            var bytes = CryptoJS.AES.decrypt(token, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            [err, account] = await to(TOA_account.findOne({
                where: { account_id: decryptedData.id, status: 0, delete: 0 },
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email'], ['pin_code', 'pinCode'], 'delete'],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branches',
                        attributes: [['branch_id', 'id'], 'CODE', ['branch_manager', 'manager'], ['branch_name', 'name'], 'contactCountryCode', ['branch_number', 'number'], 'altcontactCountryCode', ['branch_altnumber', 'altNumber'], ['branch_address', 'address'], ['branch_latitude', 'latitude'], ['branch_longitude', 'longitude']]
                    },
                    {
                        model: TOA_city,
                        as: 'city',
                        attributes: ['id', 'title'],
                        required: false,
                        include: [
                            {
                                model: TOA_country,
                                as: 'country',
                                attributes: ['id', 'title'],
                                required: false,
                            }
                        ]
                    }
                ],
            }));
            if (err) return done(err, false);
            if (account != null) {

                var accountEdit = account.toJSON();

                if (account.delete == 0) {

                    [err, purchasesPlan] = await to(TOA_plan_purchase.findOne({
                        where: { account_id: accountEdit.id, status: 0, delete: 0 },
                        attributes: [['plan_purchase_id', 'id'], 'plan_id', ['plan_title', 'title'], ['plan_sdate', 'startDate'], ['plan_edate', 'endDate']],
                        order: [['updatedAt', 'DESC']],
                    }));

                    if (purchasesPlan) {


                        let planEndDate = new Date(purchasesPlan.toJSON().endDate);
                        let currentDate = new Date();

                        if (currentDate > planEndDate) {

                            return done(null, false);

                        } else {

                            if (decryptedData.studentId) {

                                [err, user] = await to(TOA_student.findByPk(decryptedData.studentId, { where: { status: 0, delete: 0 } }));
                                if (user) {
                                    accountEdit.student = user.toJSON();
                                }
                            }
                            accountEdit.account_id = accountEdit.id;
                            accountEdit.currentPlan = purchasesPlan;
                            return done(null, accountEdit);
                        }
                    } else {
                        return done(null, false);
                    }

                } else {

                    return done(null, false);
                }
            } else {
                return done(null, false);
            }

        } else {
            return done(null, false);
        }
    }));
}