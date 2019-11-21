const authService = require('../../../services/V1/Institute/auth.service');
const authServiceTutor = require('../../../services/V1/Tutor/Authentication.service');
const planService = require('../../../services/V1/Superadmin/plan.service');
const menuService = require('../../../services/V1/Superadmin/MenuManagment.service');
const { TOA_login_device } = require('../../../models');

const { to, toWithout, ReE, ReS, UploadImage, GetSignUrl, DeleteFromBucket, SendMailUsingTOA } = require('../../../services/V1/util.service');
const { createSubDomain } = require('../../../services/V1/createsubdomain.service');

const sha1 = require('sha1');
const fs = require('fs');
const nodemailer = require('nodemailer');
const CONFIG = require('../../../config/config');
const moment = require('moment');
const Razorpay = require('razorpay')
var handlebars = require('handlebars');

const exec = require('child_process').exec;


module.exports.handleSubDomainTask = async function (req, res) {

    [err , domain] = await to(createSubDomain('Test Domain','companyzapier.example.com'));
    if (err) return ReE(res, err, 422);
    return ReS(res, 'Domain successfully.', domain);
}

// Institute Login
module.exports.login = async function (req, res) {

    const body = req.fields;

    if (!body.phone) ReE(res, 'Please enter phone number or Email', 422);
    // if (!body.phone) ReE(res, 'Please enter phone number', 422);
    if (!body.password) ReE(res, 'Please enter password.', 422);
    if (!body.deviceId) ReE(res, 'Your device can not identified.', 422);


    //Check Institute Login if found then logged in else check for tutor login
    [err, user] = await to(authService.authUser(body));
    // if (err) return ReE(res, err, 422);

    if (user) {

        let res_user = user.toWeb();
        res_user.bearer_token = user.getJWT();
        delete res_user.account_password
        delete res_user.status;
        delete res_user.delete;
        delete res_user.create_ip;
        delete res_user.update_ip;
        delete res_user.createdAt;
        delete res_user.updatedAt;
        delete res_user.sib_folder_id;
        delete res_user.UUID;

        if (res_user.account_image) {

            res_user.account_image = await GetSignUrl(res_user.account_image);
        }

        res_user.userType = 1;

        [err, plan] = await to(authService.checkPlan(user.account_id));
        if (err) return ReE(res, err, 422);

        if (plan) {

            let planEndDate = new Date(plan.plan_edate);
            let currentDate = new Date();

            if (currentDate > planEndDate) {

                return ReS(res, 'Plan Expired. please purchase new plan.', res_user, 402);
            }
        } else {

            return ReS(res, 'You don\'t have any plan please purchase new plan.', res_user, 402);
        }

        [err, loginEntry] = await to(authService.addLoginEntry(user, req.ip));
        if (err) return ReE(res, err, 422);

        res_user.plan = plan;

        // Check Notification Token
        if (body.notificationToken) {

            // Update Token To Database
            const userInfo = {

                notificationToken: body.notificationToken,
                update_ip: req.ip
            };

            [err, user] = await to(authService.updateUser(res_user.account_id, userInfo));
            if (err) return ReE(res, 'Invalid Credentials. Please try again.', 422);

        }

        const loginDeviceJson = {
            type: 'institute',
            typeId: res_user.account_id,
            userId: res_user.account_id,
            webDeviceId: body.deviceId
        };
        authService.storeLogedDevice(loginDeviceJson);

        return ReS(res, 'Login successfully.', res_user);

    } else {

        [err, tutor] = await to(authServiceTutor.checkLogin(body.phone, body.password));
        if (err) return ReE(res, err, 422);

        if (tutor) {

            let tutorJSON = tutor.toJSON();

            delete tutorJSON.password;


            [err, plan] = await to(authService.checkPlan(tutorJSON.accountId));
            if (err) return ReE(res, err, 422);

            if (plan) {

                let planEndDate = new Date(plan.plan_edate);
                let currentDate = new Date();

                if (currentDate > planEndDate) {

                    return ReE(res, 'Your account seems expired, please contact your admin.', 422);
                }

                tutorJSON.image = await GetSignUrl(tutorJSON.image);
                tutorJSON.branch.account.image = await GetSignUrl(tutorJSON.branch.account.image);
                tutorJSON.userType = 3;
                tutorJSON.plan = plan;
                tutorJSON.bearer_token = tutor.getJWT();

                if (tutorJSON.blueJeance) {
                    tutorJSON.blueJeance.response = JSON.parse(tutorJSON.blueJeance.response);
                }

                const loginDeviceJson = {
                    type: 'tutor',
                    typeId: tutorJSON.accountId,
                    userId: tutorJSON.id,
                    webDeviceId: body.deviceId
                }
                authService.storeLogedDevice(loginDeviceJson);

                return ReS(res, 'Tutor Logged successfully.', tutorJSON);

            } else {

                return ReE(res, 'Invalid Credentials. Please try again.', 422);
            }

        } else {

            return ReE(res, 'Invalid Credentials. Please try again.', 422);
        }
    }
}

// Delete Device id database
module.exports.logout = async function (req, res) {
    if (!req.headers.device_id) {
        ReE(res, 'Your device can not identified.', 422);
    }
    const deviceId = req.headers.device_id;

    [err, deleted] = await to(authService.deleteLogedDevice(deviceId));
    if (err) return ReE(res, 'Failed to logout, please try again.', 422);
    if (deleted == 1) {

        return ReS(res, 'Logout successfully.');

    } else {
        return ReE(res, 'Failed to logout, please try again.', 422);
    }
}

// Update Image
module.exports.updateAccountImage = async function (req, res) {

    if (req.files.image) {

        [err, user] = await to(authService.getUser(req.user.account_id));
        if (err) return ReE(res, err, 422);

        var imageName = user.account_image;

        if (imageName != '') {

            [err, result] = await to(DeleteFromBucket(imageName));
            if (err) return ReE(res, err, 422);
        }

        var imageBuffer = fs.readFileSync(req.files.image.path);
        var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        [err, s3Bucket] = await to(UploadImage('user', name, imageBuffer));
        if (err) return ReE(res, 'Failed to create user. please try gain.', 422);
        imageName = s3Bucket.Key;

        const userInfo = {

            account_image: imageName,
            update_ip: req.ip
        };

        [err, user] = await to(authService.updateUser(req.user.account_id, userInfo));
        if (err) return ReE(res, err, 422);

        if (user.length == 1 && user[0] == 1) {

            [err, user] = await to(authService.getUserObj(req.user.account_id));
            if (err) return ReE(res, err, 422);

            var res_user = user.toWeb();
            res_user.bearer_token = user.getJWT();
            res_user.account_image = await GetSignUrl(res_user.account_image);
            res_user.account_password = null;
            res_user.userType = 1;

            return ReS(res, 'User updated successfully.', res_user);
        } else {

            return ReE(res, 'Failed to update user, please try again.', 422);
        }
    } else {

        return ReE(res, 'Please Select image', 422);
    }
}

//Get particuler Institute
module.exports.getUser = async function (req, res) {

    [err, user] = await to(authService.getUser(req.user.account_id));
    if (err) return ReE(res, err, 422);
    if (user) {

        [err, lastPlan] = await to(authService.getLastInvoice(req.user.account_id));
        if (err) return ReE(res, err, 422);
        var userObj = user.toWeb();

        if (lastPlan) {

            var lastPlan = lastPlan.toJSON();
            lastPlan.total = lastPlan.amount + ((lastPlan.amount * lastPlan.gst) / 100);
            lastPlan.gstAmount = ((lastPlan.amount * lastPlan.gst) / 100);

            var offerAmount = 0.0;
            if (lastPlan.appledOffer) {
                if (lastPlan.currencyType == 1) {
                    offerAmount = (lastPlan.amount * lastPlan.appledOffer.discount) / 100;

                    if (offerAmount > lastPlan.appledOffer.maxAmount) {

                        offerAmount = lastPlan.appledOffer.maxAmount;
                    }
                } else if (lastPlan.currencyType == 2) {
                    offerAmount = (lastPlan.amount * lastPlan.appledOffer.discount) / 100;

                    if (offerAmount > lastPlan.appledOffer.maxDollerAmount) {

                        offerAmount = lastPlan.appledOffer.maxDollerAmount;
                    }
                }

            }

            lastPlan.discount = offerAmount;
            lastPlan.grandTotal = lastPlan.total - offerAmount;
            userObj.lastPlan = lastPlan;
        }
        userObj.account_image = await GetSignUrl(userObj.account_image);
        userObj.userType = 1;
        return ReS(res, 'User get successfully.', userObj);

    } else {

        return ReE(res, 'User not found.', 422);
    }
}

// Change Institute Password
module.exports.chnagePassword = async function (req, res) {

    const body = req.fields;
    if (!body.password) {

        return ReE(res, 'Please Enter Current password', 422);

    } else if (!body.newPassword) {

        return ReE(res, 'Please Enter New password', 422);

    } else {


        if (req.user.userType == 3) {


            [err, tutor] = await to(authServiceTutor.getTutor(req.user.id));
            if (err) return ReE(res, err, 422);
            if (sha1(body.password) == tutor.tutor_password) {

                const userInfo = {

                    tutor_password: sha1(body.newPassword),
                    update_ip: req.ip
                };

                [err, userRes] = await to(authServiceTutor.updateTutor(req.user.id, userInfo));
                if (err) return ReE(res, err, 422);

                if (userRes.length == 1 && userRes[0] == 1) {

                    [err, deletedDevice] = await to(authService.deleteAllLogedDevice(req.user.account_id, req.user.id, 'tutor'));
                    return ReS(res, 'Password updated successfully.');
                } else {

                    return ReE(res, 'Failed to update password, please try again.', 422);
                }

            } else {
                return ReE(res, 'Your old password mismatch.', 422);
            }

        } else {

            [err, user] = await to(authService.getUserObj(req.user.account_id));
            if (err) return ReE(res, err, 422);
            if (user) {

                if (sha1(body.password) == user.account_password) {

                    const userInfo = {

                        account_password: sha1(body.newPassword),
                        update_ip: req.ip
                    };

                    [err, userRes] = await to(authService.updateUser(req.user.account_id, userInfo));
                    if (err) return ReE(res, err, 422);

                    if (userRes.length == 1 && userRes[0] == 1) {

                        [err, deletedDevice] = await to(authService.deleteAllLogedDevice(req.user.account_id, req.user.account_id, 'institute'));
                        return ReS(res, 'Password updated successfully.', null);
                    } else {

                        return ReE(res, 'Failed to update password, please try again.', 422);
                    }

                } else {

                    return ReE(res, 'Your old password mismatch.', 422);
                }
            } else {

                return ReE(res, 'User not found.', 422);
            }
        }

    }
}

//Get Terms and plans Which are added by super admin for ins.
module.exports.getTermsAndPlanList = async function (req, res) {

    [err, list] = await to(authService.getAllTermsAndPlan());
    if (err) return ReE(res, err, 422);

    if (list.length == 0) {

        return ReS(res, 'All data get successfully.', 204);
    } else {


        [err, bankList] = await to(authService.getBankList());
        const resObj = { termsAndPlan: list, gatewayList: bankList };


        return ReS(res, 'All data get successfully.', resObj);
    }
}

// Check offer 
module.exports.checkAccountOffer = async function (req, res) {

    const body = req.fields;

    if (!body.termId && !body.offerCode) {

        return ReE(res, 'Request data not available.', 422);

    } else {

        [err, offer] = await to(authService.checkAccountOffer(body.termId, body.offerCode));
        if (err) return ReE(res, err, 422);

        return ReS(res, 'Offer get successfully.', offer);

    }
}

// Purchase Plan 
module.exports.purchasePlan = async function (req, res) {

    const body = req.fields;

    if (!body.termId) {

        return ReE(res, 'Please select term.', 422);

    } else if (!body.planId) {

        return ReE(res, 'Please select plan.', 422);

    } else if (!body.currencyType) {

        return ReE(res, 'Please select currency.', 422);

    } else if (!body.transactionId) {

        return ReE(res, 'Transaction id missing.', 422);

    } else {

        [err, plan] = await to(planService.getPlan(body.planId));
        if (err) {
            return ReE(res, 'Failed To purchase. please try again plan', 422);
        }

        if (!plan) {
            return ReE(res, 'Failed To purchase. please try again plan', 422);
        }

        let planObj = plan.toJSON();
        [err, term] = await to(planService.getTerm(body.termId));
        if (err) {
            return ReE(res, 'Failed To purchase. please try again term', 422);
        }

        if (!term) {

            return ReE(res, 'Failed To purchase. please try again plan', 422);
        }

        [err, invoiceList] = await to(authService.getInvoiceList(req.user.account_id));
        if (err) return ReE(res, err, 422);


        var dummyStartDate = moment();
        if (invoiceList.length > 0) {

            const lastInvoice = invoiceList[0].toJSON();
            var endingDate = moment(lastInvoice.endDate);

            if (endingDate.isSameOrAfter(dummyStartDate)) {
                dummyStartDate = endingDate.add(1, 'days');
            }
        }


        var planPurchase = {

            account_id: req.user.account_id,
            term_id: body.termId,
            plan_id: body.planId,
            plan_gst: body.gst,
            gateway_id: body.gatewayId,
            transaction_id: body.transactionId,
            plan_title: planObj.title,
            plan_amount: body.currencyType == 1 ? planObj.amount : planObj.amountUSD,
            currencyType: body.currencyType,
            create_ip: req.ip
        };

        let termObj = term.toWeb();

        planPurchase.plan_sdate = dummyStartDate.format('YYYY-MM-DD');

        var planEndDate = dummyStartDate;
        planEndDate = planEndDate.add(termObj.days, 'days');

        planPurchase.plan_edate = planEndDate.format('YYYY-MM-DD');


        if (body.offerId != '') {

            [err, offer] = await to(authService.getOffer(body.offerId, body.termId));
            if (offer) {

                planPurchase['offer_id'] = offer.id;
                planPurchase['offer_code'] = offer.code;
                planPurchase['offer_discount'] = offer.discount;
            }
        }

        [err, purchasedPlan] = await to(authService.addNewPlan(planPurchase));
        if (err) ReE(res, err.message, 422);

        if (body.subScriptionId) {

            const userInfo = { razerPaySubscriptionId: body.subScriptionId, update_ip: req.ip };

            [err, userRes] = await to(authService.updateUser(req.user.account_id, userInfo));

        }

        if (purchasedPlan) {

            if (planObj.subject_title && planObj.mail_content) {

                [err, info] = await to(SendMailUsingTOA(req.user.account_title, req.user.account_email, planObj.subject_title, planObj.mail_content));
            }

            [err, user] = await to(authService.getUser(req.user.account_id));
            if (!user) return ReE(res, err, 401);
            [err, loginEntry] = await to(authService.addLoginEntry(user, req.ip));

            let res_user = user.toWeb();
            res_user.bearer_token = user.getJWT();
            delete res_user.account_password
            delete res_user.status;
            delete res_user.delete;
            delete res_user.create_ip;
            delete res_user.update_ip;
            delete res_user.createdAt;
            delete res_user.updatedAt;
            delete res_user.sib_folder_id;
            delete res_user.UUID;

            if (res_user.account_image) {

                res_user.account_image = await GetSignUrl(res_user.account_image);
            }

            res_user.userType = 1;
            [err, plan] = await to(authService.checkPlan(user.account_id));
            if (err) return ReE(res, err, 422);

            res_user.plan = plan;


            return ReS(res, 'Plan purchase successfully.', res_user);
        }
        else {

            return ReE(res, 'Failed to purchase plan.', 422);
        }
    }
}

// Get All  Purchased Plan List
module.exports.getPurchasedPlanList = async function (req, res) {

    [err, invoiceList] = await to(authService.getInvoiceList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (invoiceList.length == 0) {

        return ReE(res, 'There is no any invoice.', 204);

    } else {

        var invoiceModifiedList = [];

        await Promise.all(invoiceList.map(async (invoice) => {

            var invoice = invoice.toJSON();
            invoice.total = invoice.amount + ((invoice.amount * invoice.gst) / 100);
            invoice.gstAmount = ((invoice.amount * invoice.gst) / 100);

            var offerAmount = 0.0;
            if (invoice.appledOffer) {

                if (invoice.currencyType == 1) {

                    offerAmount = (invoice.amount * invoice.appledOffer.discount) / 100;

                    if (offerAmount > invoice.appledOffer.maxAmount) {

                        offerAmount = invoice.appledOffer.maxAmount;
                    }
                } else if (invoice.currencyType == 2) {
                    offerAmount = (invoice.amount * invoice.appledOffer.discount) / 100;

                    if (offerAmount > invoice.appledOffer.maxDollerAmount) {
                        offerAmount = invoice.appledOffer.maxDollerAmount;
                    }

                }
            }

            invoice.discount = offerAmount;
            invoice.grandTotal = invoice.total - offerAmount;
            invoiceModifiedList.push(invoice)

        }));

        return ReS(res, 'Term List Get Successfully.', invoiceModifiedList);
    }

}

// Send Forgot password mail
module.exports.forGotPasswordReset = async function (req, res) {

    const body = req.fields;
    if (!body.email) {

        return ReE(res, 'Please enter email id.', 422);

    } else {

        var user = null;
        var isAccount = true;
        [err, user] = await to(authService.forGotPasswordReset(body.email));

        if (user == null) {

            [err, user] = await to(authServiceTutor.getTutorByEmail(body.email));
            isAccount = false;
        }

        if (user) {

            let transporter = nodemailer.createTransport({
                pool: true,
                host: CONFIG.SMTP_Host,
                port: CONFIG.SMTP_Port,
                secure: true,
                auth: {
                    user: CONFIG.SMTP_UserEmail,
                    pass: CONFIG.SMTP_UserPassword
                }
            });

            let token = user.getJWT();

            let urlToken = CONFIG.instituteDomain + "changepassword/" + token;

            let reSetHTML = `<!DOCTYPE html
         PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
         xmlns:o="urn:schemas-microsoft-com:office:office">
     
         <head>
             <meta http-equiv="X-UA-Compatible" content="IE=edge" />
             <meta name="viewport" content="width=device-width, initial-scale=1" />
             <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
             <meta name="x-apple-disable-message-reformatting" />
             <meta name="apple-mobile-web-app-capable" content="yes" />
             <meta name="apple-mobile-web-app-status-bar-style" content="black" />
             <meta name="format-detection" content="telephone=no" />
             <title></title>
             <style type="text/css">
                 /* Resets */
     
                 .ReadMsgBody {
                     width: 100%;
                     background-color: #ebebeb;
                 }
     
                 .ExternalClass {
                     width: 100%;
                     background-color: #ebebeb;
                 }
     
                 .ExternalClass,
                 .ExternalClass p,
                 .ExternalClass span,
                 .ExternalClass font,
                 .ExternalClass td,
                 .ExternalClass div {
                     line-height: 100%;
                 }
     
                 a[x-apple-data-detectors] {
                     color: inherit !important;
                     text-decoration: none !important;
                     font-size: inherit !important;
                     font-family: inherit !important;
                     font-weight: inherit !important;
                     line-height: inherit !important;
                 }
     
                 body {
                     -webkit-text-size-adjust: none;
                     -ms-text-size-adjust: none;
                 }
     
                 body {
                     margin: 0;
                     padding: 0;
                 }
     
                 .yshortcuts a {
                     border-bottom: none !important;
                 }
     
                 .rnb-del-min-width {
                     min-width: 0 !important;
                 }
     
                 /* Add new outlook css start */
     
                 .templateContainer {
                     max-width: 590px !important;
                     width: auto !important;
                 }
     
                 /* Add new outlook css end */
                 /* Image width by default for 3 columns */
     
                 img[class="rnb-col-3-img"] {
                     max-width: 170px;
                 }
     
                 /* Image width by default for 2 columns */
     
                 img[class="rnb-col-2-img"] {
                     max-width: 264px;
                 }
     
                 /* Image width by default for 2 columns aside small size */
     
                 img[class="rnb-col-2-img-side-xs"] {
                     max-width: 180px;
                 }
     
                 /* Image width by default for 2 columns aside big size */
     
                 img[class="rnb-col-2-img-side-xl"] {
                     max-width: 350px;
                 }
     
                 /* Image width by default for 1 column */
     
                 img[class="rnb-col-1-img"] {
                     max-width: 550px;
                 }
     
                 /* Image width by default for header */
     
                 img[class="rnb-header-img"] {
                     max-width: 590px;
                 }
     
                 /* Ckeditor line-height spacing */
     
                 .rnb-force-col p,
                 ul,
                 ol {
                     margin: 0px !important;
                 }
     
                 .rnb-del-min-width p,
                 ul,
                 ol {
                     margin: 0px !important;
                 }
     
                 /* tmpl-2 preview */
     
                 .rnb-tmpl-width {
                     width: 100% !important;
                 }
     
                 /* tmpl-11 preview */
     
                 .rnb-social-width {
                     padding-right: 15px !important;
                 }
     
                 /* tmpl-11 preview */
     
                 .rnb-social-align {
                     float: right !important;
                 }
     
                 /* Ul Li outlook extra spacing fix */
     
                 li {
                     mso-margin-top-alt: 0;
                     mso-margin-bottom-alt: 0;
                 }
     
                 /* Outlook fix */
     
                 table {
                     mso-table-lspace: 0pt;
                     mso-table-rspace: 0pt;
                 }
     
                 /* Outlook fix */
     
                 table,
                 tr,
                 td {
                     border-collapse: collapse;
                 }
     
                 /* Outlook fix */
     
                 p,
                 a,
                 li,
                 blockquote {
                     mso-line-height-rule: exactly;
                 }
     
                 /* Outlook fix */
     
                 .msib-right-img {
                     mso-padding-alt: 0 !important;
                 }
     
                 /* Fix text line height on preview */
     
                 .content-spacing div {
                     display: list-item;
                     list-style-type: none;
                 }
     
                 @media only screen and (min-width:590px) {
     
                     /* mac fix width */
                     .templateContainer {
                         width: 590px !important;
                     }
                 }
     
                 @media screen and (max-width: 360px) {
     
                     /* yahoo app fix width "tmpl-2 tmpl-10 tmpl-13" in android devices */
                     .rnb-yahoo-width {
                         width: 360px !important;
                     }
                 }
     
                 @media screen and (max-width: 380px) {
     
                     /* fix width and font size "tmpl-4 tmpl-6" in mobile preview */
                     .element-img-text {
                         font-size: 24px !important;
                     }
     
                     .element-img-text2 {
                         width: 230px !important;
                     }
     
                     .content-img-text-tmpl-6 {
                         font-size: 24px !important;
                     }
     
                     .content-img-text2-tmpl-6 {
                         width: 220px !important;
                     }
                 }
     
                 @media screen and (max-width: 480px) {
                     td[class="rnb-container-padding"] {
                         padding-left: 10px !important;
                         padding-right: 10px !important;
                     }
     
                     /* force container nav to (horizontal) blocks */
                     td.rnb-force-nav {
                         display: inherit;
                     }
     
                     /* fix text alignment "tmpl-11" in mobile preview */
                     .rnb-social-text-left {
                         width: 100%;
                         text-align: center;
                         margin-bottom: 15px;
                     }
     
                     .rnb-social-text-right {
                         width: 100%;
                         text-align: center;
                     }
                 }
     
                 @media only screen and (max-width: 600px) {
     
                     /* center the address &amp; social icons */
                     .rnb-text-center {
                         text-align: center !important;
                     }
     
                     /* force container columns to (horizontal) blocks */
                     th.rnb-force-col {
                         display: block;
                         padding-right: 0 !important;
                         padding-left: 0 !important;
                         width: 100%;
                     }
     
                     table.rnb-container {
                         width: 100% !important;
                     }
     
                     table.rnb-btn-col-content {
                         width: 100% !important;
                     }
     
                     table.rnb-col-3 {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                         /* change left/right padding and margins to top/bottom ones */
                         margin-bottom: 10px;
                         padding-bottom: 10px;
                         /*border-bottom: 1px solid #eee;*/
                     }
     
                     table.rnb-last-col-3 {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                     }
     
                     table.rnb-col-2 {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                         /* change left/right padding and margins to top/bottom ones */
                         margin-bottom: 10px;
                         padding-bottom: 10px;
                         /*border-bottom: 1px solid #eee;*/
                     }
     
                     table.rnb-col-2-noborder-onright {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                         /* change left/right padding and margins to top/bottom ones */
                         margin-bottom: 10px;
                         padding-bottom: 10px;
                     }
     
                     table.rnb-col-2-noborder-onleft {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                         /* change left/right padding and margins to top/bottom ones */
                         margin-top: 10px;
                         padding-top: 10px;
                     }
     
                     table.rnb-last-col-2 {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                     }
     
                     table.rnb-col-1 {
                         /* unset table align="left/right" */
                         float: none !important;
                         width: 100% !important;
                     }
     
                     img.rnb-col-3-img {
                         /**max-width:none !important;**/
                         width: 100% !important;
                     }
     
                     img.rnb-col-2-img {
                         /**max-width:none !important;**/
                         width: 100% !important;
                     }
     
                     img.rnb-col-2-img-side-xs {
                         /**max-width:none !important;**/
                         width: 100% !important;
                     }
     
                     img.rnb-col-2-img-side-xl {
                         /**max-width:none !important;**/
                         width: 100% !important;
                     }
     
                     img.rnb-col-1-img {
                         /**max-width:none !important;**/
                         width: 100% !important;
                     }
     
                     img.rnb-header-img {
                         /**max-width:none !important;**/
                         width: 100% !important;
                         margin: 0 auto;
                     }
     
                     img.rnb-logo-img {
                         /**max-width:none !important;**/
                         width: 100% !important;
                     }
     
                     td.rnb-mbl-float-none {
                         float: inherit !important;
                     }
     
                     .img-block-center {
                         text-align: center !important;
                     }
     
                     .logo-img-center {
                         float: inherit !important;
                     }
     
                     /* tmpl-11 preview */
                     .rnb-social-align {
                         margin: 0 auto !important;
                         float: inherit !important;
                     }
     
                     /* tmpl-11 preview */
                     .rnb-social-center {
                         display: inline-block;
                     }
     
                     /* tmpl-11 preview */
                     .social-text-spacing {
                         margin-bottom: 0px !important;
                         padding-bottom: 0px !important;
                     }
     
                     /* tmpl-11 preview */
                     .social-text-spacing2 {
                         padding-top: 15px !important;
                     }
                 }
             </style>
             <!--[if gte mso 11]><style type="text/css">table{border-spacing: 0; }table td {border-collapse: separate;}</style><![endif]-->
             <!--[if !mso]><!-->
             <style type="text/css">
                 table {
                     border-spacing: 0;
                 }
     
                 table td {
                     border-collapse: collapse;
                 }
             </style>
             <!--<![endif]-->
             <!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
             <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
         </head>
     
         <body>
     
             <table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" class="main-template"
                 bgcolor="#f9fafc" style="background-color: rgb(249, 250, 252);">
     
                 <tbody>
                     <tr style="display:none !important; font-size:1px; mso-hide: all;">
                         <td></td>
                         <td></td>
                     </tr>
                     <tr>
                         <td align="center" valign="top">
                             <!--[if gte mso 9]>
                                 <table align="center" border="0" cellspacing="0" cellpadding="0" width="590" style="width:590px;">
                                 <tr>
                                 <td align="center" valign="top" width="590" style="width:590px;">
                                 <![endif]-->
                             <table border="0" cellpadding="0" cellspacing="0" width="590" class="templateContainer"
                                 style="max-width:590px!important; width: 590px;">
                                 <tbody>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                 cellspacing="0" style="min-width:590px;" name="Layout_0" id="Layout_0">
                                                 <tbody>
                                                     <tr>
                                                         <td class="rnb-del-min-width" valign="top" align="center"
                                                             style="min-width:590px;">
                                                             <table width="100%" cellpadding="0" border="0" height="38"
                                                                 cellspacing="0">
                                                                 <tbody>
                                                                     <tr>
                                                                         <td valign="top" height="38">
                                                                             <img width="20" height="38"
                                                                                 style="display:block; max-height:38px; max-width:20px;"
                                                                                 alt=""
                                                                                 src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                         </td>
                                                                     </tr>
                                                                 </tbody>
                                                             </table>
                                                         </td>
                                                     </tr>
                                                 </tbody>
                                             </table>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
     
                                                 <!--[if mso]>
                         <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                         <tr>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         <td valign="top" width="590" style="width:590px;">
                         <![endif]-->
                                                 <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                     cellspacing="0" style="min-width:590px;" name="Layout_1" id="Layout_1">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top"
                                                                 style="min-width:590px;">
                                                                 <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                                     class="rnb-container" bgcolor="#ffffff"
                                                                     style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td valign="top" class="rnb-container-padding"
                                                                                 align="left">
                                                                                 <table width="100%" cellpadding="0" border="0"
                                                                                     align="center" cellspacing="0">
                                                                                     <tbody>
                                                                                         <tr>
                                                                                             <td valign="top" align="center">
                                                                                                 <table cellpadding="0"
                                                                                                     border="0" align="center"
                                                                                                     cellspacing="0"
                                                                                                     class="logo-img-center">
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td valign="middle"
                                                                                                                 align="center"
                                                                                                                 style="line-height: 1px;">
                                                                                                                 <div style="border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block; "
                                                                                                                     cellspacing="0"
                                                                                                                     cellpadding="0"
                                                                                                                     border="0">
                                                                                                                     <div>
                                                                                                                         <a style="text-decoration:none;"
                                                                                                                             target="_blank"
                                                                                                                             href="https://example.com/"><img
                                                                                                                                 width="209"
                                                                                                                                 vspace="0"
                                                                                                                                 hspace="0"
                                                                                                                                 border="0"
                                                                                                                                 alt="Company Inc."
                                                                                                                                 style="float: left;max-width:209px;"
                                                                                                                                 class="rnb-logo-img"
                                                                                                                                 src="{{logo}}"></a>
                                                                                                                     </div>
                                                                                                                 </div>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </td>
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                                 <!--[if mso]>
                         </td>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         </tr>
                         </table>
                         <![endif]-->
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
     
                                                 <!--[if mso]>
                         <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                         <tr>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         <td valign="top" width="590" style="width:590px;">
                         <![endif]-->
     
                                                 <table width="100%" cellpadding="0" border="0" cellspacing="0" name="Layout_"
                                                     id="Layout_">
                                                     <tbody>
                                                         <tr>
                                                             <td align="center" valign="top">
                                                                 <table border="0" width="100%" cellpadding="0" cellspacing="0"
                                                                     class="rnb-container" bgcolor="#ffffff"
                                                                     style="height: 0px; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding-left: 20px; padding-right: 20px;">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td class="rnb-container-padding"
                                                                                 style="font-size: px;font-family: ; color: ;">
     
                                                                                 <table border="0" cellpadding="0"
                                                                                     cellspacing="0"
                                                                                     class="rnb-columns-container" align="center"
                                                                                     style="margin:auto;">
                                                                                     <tbody>
                                                                                         <tr>
     
                                                                                             <th class="rnb-force-col"
                                                                                                 align="center">
     
                                                                                                 <table border="0"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0"
                                                                                                     align="center"
                                                                                                     class="rnb-col-1">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td height="10">
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                         <tr>
                                                                                                             <td height="10">
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
     
                                                                     </tbody>
                                                                 </table>
     
                                                             </td>
                                                         </tr>
     
                                                     </tbody>
                                                 </table>
                                                 <!--[if mso]>
                         </td>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         </tr>
                         </table>
                         <![endif]-->
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
     
                                                 <!--[if mso]>
                         <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                         <tr>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         <td valign="top" width="590" style="width:590px;">
                         <![endif]-->
                                                 <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                     cellspacing="0" style="min-width:100%;" name="Layout_5">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top">
                                                                 <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                                     class="rnb-container" bgcolor="#ffffff"
                                                                     style="background-color: rgb(255, 255, 255); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);">
     
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td valign="top" class="rnb-container-padding"
                                                                                 align="left">
     
                                                                                 <table width="100%" border="0" cellpadding="0"
                                                                                     cellspacing="0"
                                                                                     class="rnb-columns-container">
                                                                                     <tbody>
                                                                                         <tr>
                                                                                             <th class="rnb-force-col"
                                                                                                 style="text-align: left; font-weight: normal; padding-right: 0px;"
                                                                                                 valign="top">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" width="100%"
                                                                                                     align="left"
                                                                                                     class="rnb-col-1">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td class="content-spacing"
                                                                                                                 style="font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858; line-height: 21px;">
                                                                                                                 <div
                                                                                                                     style="text-align: justify;">
                                                                                                                     <span
                                                                                                                         style="font-size:16px;font-weight: bold;">Welcome,
                                                                                                                         {{name}}</span>
                                                                                                                 </div>
     
                                                                                                                 <div
                                                                                                                     style="text-align: justify;">
                                                                                                                     <br>
                                                                                                                     <span
                                                                                                                         style="font-size:16px;">We've
                                                                                                                         received
                                                                                                                         a
                                                                                                                         request
                                                                                                                         to
                                                                                                                         reset
                                                                                                                         your
                                                                                                                         password.
                                                                                                                         if you
                                                                                                                         didn't
                                                                                                                         make the
                                                                                                                         request,
                                                                                                                         just
                                                                                                                         ignore
                                                                                                                         this
                                                                                                                         email.
                                                                                                                         Otherwise,
                                                                                                                         you can
                                                                                                                         reset
                                                                                                                         your
                                                                                                                         password
                                                                                                                         using
                                                                                                                         this
                                                                                                                         link.</span>
                                                                                                                 </div>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
     
                                                                                             </th>
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                                 <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                     cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top"
                                                                 style="min-width:590px;">
                                                                 <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                                     class="mso-button-block rnb-container"
                                                                     style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td valign="top" class="rnb-container-padding"
                                                                                 align="left">
     
                                                                                 <table width="100%" border="0" cellpadding="0"
                                                                                     cellspacing="0"
                                                                                     class="rnb-columns-container">
                                                                                     <tbody>
                                                                                         <tr>
                                                                                             <th class="rnb-force-col"
                                                                                                 valign="top">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" width="550"
                                                                                                     align="center"
                                                                                                     class="rnb-col-1">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td valign="top">
                                                                                                                 <table
                                                                                                                     cellpadding="0"
                                                                                                                     border="0"
                                                                                                                     align="center"
                                                                                                                     cellspacing="0"
                                                                                                                     class="rnb-btn-col-content"
                                                                                                                     style="margin:auto; border-collapse: separate;">
                                                                                                                     <tbody>
                                                                                                                         <tr>
                                                                                                                             <td width="auto"
                                                                                                                                 valign="middle"
                                                                                                                                 bgcolor="#f56b58"
                                                                                                                                 align="center"
                                                                                                                                 height="40"
                                                                                                                                 style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                                 <span
                                                                                                                                     style="color:#ffffff; font-weight:normal;">
                                                                                                                                     <a href="{{urlToken}}"
                                                                                                                                         style="text-decoration:none; color:#ffffff; font-weight:normal;"
                                                                                                                                         target="_blank">Click
                                                                                                                                         here
                                                                                                                                         to
                                                                                                                                         reset
                                                                                                                                         your
                                                                                                                                         password</a>
                                                                                                                                 </span>
                                                                                                                             </td>
                                                                                                                         </tr>
                                                                                                                     </tbody>
                                                                                                                 </table>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
     
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                                 <!--[if mso]>
                         </td>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         </tr>
                         </table>
                         <![endif]-->
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                 cellspacing="0" style="min-width:590px;" name="Layout_" id="Layout_">
                                                 <tbody>
                                                     <tr>
                                                         <td class="rnb-del-min-width" valign="top" align="center"
                                                             style="min-width:590px;">
                                                             <table width="100%" cellpadding="0" border="0" height="30"
                                                                 cellspacing="0">
                                                                 <tbody>
                                                                     <tr>
                                                                         <td valign="top" height="30">
                                                                             <img width="20" height="30"
                                                                                 style="display:block; max-height:30px; max-width:20px;"
                                                                                 alt=""
                                                                                 src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                         </td>
                                                                     </tr>
                                                                 </tbody>
                                                             </table>
                                                         </td>
                                                     </tr>
                                                 </tbody>
                                             </table>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
     
                                                 <!--[if mso 15]>
                         <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                         <tr>
                         <![endif]-->
     
                                                 <!--[if mso 15]>
                         <td valign="top" width="590" style="width:590px;">
                         <![endif]-->
                                                 <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                     cellspacing="0" style="min-width:100%;" name="Layout_7" id="Layout_7">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top">
                                                                 <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                                     class="rnb-container" bgcolor="#ffffff"
                                                                     style="max-width: 100%; min-width: 100%; table-layout: fixed; background-color: rgb(255, 255, 255); border-radius: 0px; border-collapse: separate; padding: 20px;">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td valign="top" class="rnb-container-padding"
                                                                                 align="left">
     
                                                                                 <table width="100%" border="0" cellpadding="0"
                                                                                     cellspacing="0"
                                                                                     class="rnb-columns-container">
                                                                                     <tbody>
                                                                                         <tr>
     
                                                                                             <th class="rnb-force-col img-block-center"
                                                                                                 style="text-align: left; font-weight: normal; padding-right: 20px;"
                                                                                                 valign="top" width="180">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" align="left"
                                                                                                     class="rnb-col-2-noborder-onright"
                                                                                                     width="180">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td width="100%"
                                                                                                                 style="line-height: 1px;"
                                                                                                                 class="img-block-center"
                                                                                                                 valign="top"
                                                                                                                 align="left">
                                                                                                                 <div
                                                                                                                     style="border-top:0px none #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;display:inline-block;">
                                                                                                                     <div><img
                                                                                                                             alt=""
                                                                                                                             border="0"
                                                                                                                             hspace="0"
                                                                                                                             vspace="0"
                                                                                                                             width="180"
                                                                                                                             style="vertical-align:top; float: left; width:180px;max-width:180px !important; "
                                                                                                                             class="rnb-col-2-img-side-xl"
                                                                                                                             src="https://img.mailinblue.com/2598720/images/rnb/original/5e2ae760c520a8cd302e4794.jpg">
                                                                                                                     </div>
                                                                                                                     <div
                                                                                                                         style="clear:both;">
                                                                                                                     </div>
                                                                                                                 </div>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
                                                                                             <th class="rnb-force-col"
                                                                                                 style="text-align: left; font-weight: normal"
                                                                                                 valign="top">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" width="350"
                                                                                                     align="left"
                                                                                                     class="rnb-last-col-2">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td
                                                                                                                 style="font-size:24px; font-family:Arial,Helvetica,sans-serif; color:#3c4858; text-align:left;">
                                                                                                                 <span
                                                                                                                     style="color:#3c4858; "><span
                                                                                                                         style="font-size: 18px;"><b>Feel
                                                                                                                             free
                                                                                                                             to
                                                                                                                             reach
                                                                                                                             out
                                                                                                                             to
                                                                                                                             us&nbsp;</b></span></span>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                         <tr>
                                                                                                             <td height="10"
                                                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                                                 &nbsp;</td>
                                                                                                         </tr>
                                                                                                         <tr>
                                                                                                             <td class="rnb-mbl-float-none"
                                                                                                                 style="font-size:14px; font-family:Arial,Helvetica,sans-serif;color:#3c4858;float:right;width:350px; line-height: 21px;">
                                                                                                                 <div>Keep
                                                                                                                     exploring
                                                                                                                     around and
                                                                                                                     let us know
                                                                                                                     if you need
                                                                                                                     any help. We
                                                                                                                     can be
                                                                                                                     approached
                                                                                                                     via
                                                                                                                     following
                                                                                                                     ways.</div>
     
                                                                                                                 <div><span
                                                                                                                         style="background-color: transparent;">Email
                                                                                                                         us -
                                                                                                                         support@example.com,
                                                                                                                     </span>
                                                                                                                 </div>
     
                                                                                                                 <div><span
                                                                                                                         style="background-color: transparent;">
                                                                                                                         Call us - +14157078933.</span>
                                                                                                                 </div>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
     
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
     
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                                 <!--[if mso 15]>
                         </td>
                         <![endif]-->
     
                                                 <!--[if mso 15]>
                         </tr>
                         </table>
                         <![endif]-->
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(255, 255, 255); border-radius: 0px;">
     
                                                 <!--[if mso]>
                         <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                         <tr>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         <td valign="top" width="590" style="width:590px;">
                         <![endif]-->
                                                 <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                     cellspacing="0" style="min-width:590px;" name="Layout_8" id="Layout_8">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top"
                                                                 style="min-width:590px;">
                                                                 <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                                     class="mso-button-block rnb-container"
                                                                     style="background-color: rgb(255, 255, 255); border-radius: 0px; padding-left: 20px; padding-right: 20px; border-collapse: separate;">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td valign="top" class="rnb-container-padding"
                                                                                 align="left">
     
                                                                                 <table width="100%" border="0" cellpadding="0"
                                                                                     cellspacing="0"
                                                                                     class="rnb-columns-container">
                                                                                     <tbody>
                                                                                         <tr>
                                                                                             <th class="rnb-force-col"
                                                                                                 valign="top">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" width="550"
                                                                                                     align="center"
                                                                                                     class="rnb-col-1">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td valign="top">
                                                                                                                 <table
                                                                                                                     cellpadding="0"
                                                                                                                     border="0"
                                                                                                                     align="center"
                                                                                                                     cellspacing="0"
                                                                                                                     class="rnb-btn-col-content"
                                                                                                                     style="margin:auto; border-collapse: separate;">
                                                                                                                     <tbody>
                                                                                                                         <tr>
                                                                                                                             <td width="auto"
                                                                                                                                 valign="middle"
                                                                                                                                 bgcolor="#f56b58"
                                                                                                                                 align="center"
                                                                                                                                 height="40"
                                                                                                                                 style="font-size:18px; font-family:Arial,Helvetica,sans-serif; color:#ffffff; font-weight:normal; padding-left:20px; padding-right:20px; vertical-align: middle; background-color:#f56b58;border-radius:4px;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;">
                                                                                                                                 <span
                                                                                                                                     style="color:#ffffff; font-weight:normal;">
                                                                                                                                     <a style="text-decoration:none; color:#ffffff; font-weight:normal;" href="https://support.example.com/kb/en" target="_blank">Raise a ticket !!!</a>
                                                                                                                                 </span>
                                                                                                                             </td>
                                                                                                                         </tr>
                                                                                                                     </tbody>
                                                                                                                 </table>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
     
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                                 <!--[if mso]>
                         </td>
                         <![endif]-->
     
                                                 <!--[if mso]>
                         </tr>
                         </table>
                         <![endif]-->
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(249, 250, 252);">
     
                                                 <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0"
                                                     border="0" cellspacing="0" style="min-width:590px;" name="Layout_"
                                                     id="Layout_">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top"
                                                                 bgcolor="#f9fafc"
                                                                 style="min-width: 590px; background-color: rgb(249, 250, 252);">
                                                                 <table width="590" class="rnb-container" cellpadding="0"
                                                                     border="0" align="center" cellspacing="0">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td valign="top" class="rnb-container-padding"
                                                                                 style="font-size: 14px; font-family: Arial,Helvetica,sans-serif; color: #888888;"
                                                                                 align="left">
     
                                                                                 <table width="100%" border="0" cellpadding="0"
                                                                                     cellspacing="0"
                                                                                     class="rnb-columns-container">
                                                                                     <tbody>
                                                                                         <tr>
                                                                                             <th class="rnb-force-col"
                                                                                                 style="padding-right:20px; padding-left:20px; mso-padding-alt: 0 0 0 20px; font-weight: normal;"
                                                                                                 valign="top">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" width="264"
                                                                                                     align="left"
                                                                                                     class="rnb-col-2 rnb-social-text-left"
                                                                                                     style="border-bottom:0;">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td valign="top">
                                                                                                                 <table
                                                                                                                     cellpadding="0"
                                                                                                                     border="0"
                                                                                                                     align="left"
                                                                                                                     cellspacing="0"
                                                                                                                     class="rnb-btn-col-content">
                                                                                                                     <tbody>
                                                                                                                         <tr>
                                                                                                                             <td valign="middle"
                                                                                                                                 align="left"
                                                                                                                                 style="font-size:14px; font-family:Arial,Helvetica,sans-serif; color:#888888; line-height: 16px"
                                                                                                                                 class="rnb-text-center">
                                                                                                                                 <div>
                                                                                                                                     <div>platform.example.com&nbsp;</div>
                                                                                                                                     <div>340 S Lemon Ave,</div>
                                                                                                                                     <div>#9894 Walnut,</div>
                                                                                                                                     <div>Ca 91789</div>
                                                                                                                                 </div>
                                                                                                                             </td>
                                                                                                                         </tr>
                                                                                                                     </tbody>
                                                                                                                 </table>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
                                                                                             <th ng-if="item.text.align=='left'"
                                                                                                 class="rnb-force-col rnb-social-width"
                                                                                                 valign="top"
                                                                                                 style="mso-padding-alt: 0 20px 0 0; padding-right: 15px;">
     
                                                                                                 <table border="0" valign="top"
                                                                                                     cellspacing="0"
                                                                                                     cellpadding="0" width="246"
                                                                                                     align="right"
                                                                                                     class="rnb-last-col-2">
     
                                                                                                     <tbody>
                                                                                                         <tr>
                                                                                                             <td valign="top">
                                                                                                                 <table
                                                                                                                     cellpadding="0"
                                                                                                                     border="0"
                                                                                                                     cellspacing="0"
                                                                                                                     class="rnb-social-align"
                                                                                                                     style="float: right;"
                                                                                                                     align="right">
                                                                                                                     <tbody>
                                                                                                                         <tr>
                                                                                                                             <td valign="middle"
                                                                                                                                 class="rnb-text-center"
                                                                                                                                 ng-init="width=setSocialIconsBlockWidth(item)"
                                                                                                                                 width="125"
                                                                                                                                 align="right">
                                                                                                                                 <div
                                                                                                                                     class="rnb-social-center">
                                                                                                                                     <table
                                                                                                                                         align="left"
                                                                                                                                         style="float:left; display: inline-block"
                                                                                                                                         border="0"
                                                                                                                                         cellpadding="0"
                                                                                                                                         cellspacing="0">
                                                                                                                                         <tbody>
                                                                                                                                             <tr>
                                                                                                                                                 <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;"
                                                                                                                                                     align="left">
                                                                                                                                                     <span
                                                                                                                                                         style="color:#ffffff; font-weight:normal;">
                                                                                                                                                         <a target="_blank"
                                                                                                                                                             href="https://www.facebook.com/Utobians"><img
                                                                                                                                                                 alt="Facebook"
                                                                                                                                                                 border="0"
                                                                                                                                                                 hspace="0"
                                                                                                                                                                 vspace="0"
                                                                                                                                                                 style="vertical-align:top;"
                                                                                                                                                                 target="_blank"
                                                                                                                                                                 src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_fb.png"></a>
                                                                                                                                                     </span>
                                                                                                                                                 </td>
                                                                                                                                             </tr>
                                                                                                                                         </tbody>
                                                                                                                                     </table>
                                                                                                                                 </div>
                                                                                                                                 <div
                                                                                                                                     class="rnb-social-center">
                                                                                                                                     <table
                                                                                                                                         align="left"
                                                                                                                                         style="float:left; display: inline-block"
                                                                                                                                         border="0"
                                                                                                                                         cellpadding="0"
                                                                                                                                         cellspacing="0">
                                                                                                                                         <tbody>
                                                                                                                                             <tr>
                                                                                                                                                 <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;"
                                                                                                                                                     align="left">
                                                                                                                                                     <span
                                                                                                                                                         style="color:#ffffff; font-weight:normal;">
                                                                                                                                                         <a target="_blank"
                                                                                                                                                             href="https://www.linkedin.com/company/company/"><img
                                                                                                                                                                 alt="Twitter"
                                                                                                                                                                 border="0"
                                                                                                                                                                 hspace="0"
                                                                                                                                                                 vspace="0"
                                                                                                                                                                 style="vertical-align:top;"
                                                                                                                                                                 target="_blank"
                                                                                                                                                                 src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_tw.png"></a>
                                                                                                                                                     </span>
                                                                                                                                                 </td>
                                                                                                                                             </tr>
                                                                                                                                         </tbody>
                                                                                                                                     </table>
                                                                                                                                 </div>
                                                                                                                                 <div
                                                                                                                                     class="rnb-social-center">
                                                                                                                                     <table
                                                                                                                                         align="left"
                                                                                                                                         style="float:left; display: inline-block"
                                                                                                                                         border="0"
                                                                                                                                         cellpadding="0"
                                                                                                                                         cellspacing="0">
                                                                                                                                         <tbody>
                                                                                                                                             <tr>
                                                                                                                                                 <td style="padding:0px 5px 5px 0px; mso-padding-alt: 0px 2px 5px 0px;"
                                                                                                                                                     align="left">
                                                                                                                                                     <span
                                                                                                                                                         style="color:#ffffff; font-weight:normal;">
                                                                                                                                                         <a target="_blank"
                                                                                                                                                             href="https://www.linkedin.com/company/company/"><img
                                                                                                                                                                 alt="LinkedIn"
                                                                                                                                                                 border="0"
                                                                                                                                                                 hspace="0"
                                                                                                                                                                 vspace="0"
                                                                                                                                                                 style="vertical-align:top;"
                                                                                                                                                                 target="_blank"
                                                                                                                                                                 src="http://img.mailinblue.com/new_images/rnb/theme1/rnb_ico_in.png"></a>
                                                                                                                                                     </span>
                                                                                                                                                 </td>
                                                                                                                                             </tr>
                                                                                                                                         </tbody>
                                                                                                                                     </table>
                                                                                                                                 </div>
                                                                                                                             </td>
                                                                                                                         </tr>
                                                                                                                     </tbody>
                                                                                                                 </table>
                                                                                                             </td>
                                                                                                         </tr>
                                                                                                     </tbody>
                                                                                                 </table>
                                                                                             </th>
                                                                                         </tr>
                                                                                     </tbody>
                                                                                 </table>
                                                                             </td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
     
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(249, 250, 252);">
     
                                                 <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0"
                                                     border="0" cellspacing="0" style="min-width:590px;" name="Layout_3"
                                                     id="Layout_3">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top"
                                                                 bgcolor="#f9fafc"
                                                                 style="min-width:590px; background-color: #f9fafc; text-align: center;">
                                                                 <table width="590" class="rnb-container" cellpadding="0"
                                                                     border="0" align="center" cellspacing="0" bgcolor="#f9fafc"
                                                                     style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="10"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td>
                                                                                 <div
                                                                                     style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                     <div>This email was sent to {{ emailId }}
                                                                                         <div>You received this email because
                                                                                             have signed up on
                                                                                             www.example.com&nbsp;</div>
                                                                                     </div>
                                                                                 </div>
                                                                                 <div
                                                                                     style="display: block; text-align: center;">
                                                                                     <span
                                                                                         style="font-size:14px; font-weight:normal; display: inline-block; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                         <a style="text-decoration:underline; color:#666666;font-size:14px;font-weight:normal;font-family:Arial,Helvetica,sans-serif;"
                                                                                             target="_blank"
                                                                                             href="{{ unsubscribe }}">Unsubscribe
                                                                                             here</a>
                                                                                     </span>
                                                                                 </div>
                                                                             </td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td height="10"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <div style="background-color: rgb(249, 250, 252);">
     
                                                 <table class="rnb-del-min-width rnb-tmpl-width" width="100%" cellpadding="0"
                                                     border="0" cellspacing="0" style="min-width:590px;" name="Layout_4"
                                                     id="Layout_4">
                                                     <tbody>
                                                         <tr>
                                                             <td class="rnb-del-min-width" align="center" valign="top"
                                                                 style="min-width:590px;">
                                                                 <table width="100%" cellpadding="0" border="0" align="center"
                                                                     cellspacing="0" bgcolor="#f9fafc"
                                                                     style="padding-right: 20px; padding-left: 20px; background-color: rgb(249, 250, 252);">
                                                                     <tbody>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td
                                                                                 style="font-size:14px; color:#888888; font-weight:normal; text-align:center; font-family:Arial,Helvetica,sans-serif;">
                                                                                 <div>©2021 Company Inc.</div>
                                                                             </td>
                                                                         </tr>
                                                                         <tr>
                                                                             <td height="20"
                                                                                 style="font-size:1px; line-height:0px; mso-hide: all;">
                                                                                 &nbsp;</td>
                                                                         </tr>
                                                                     </tbody>
                                                                 </table>
                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
     
                                             </div>
                                         </td>
                                     </tr>
                                     <tr>
     
                                         <td align="center" valign="top">
     
                                             <table class="rnb-del-min-width" width="100%" cellpadding="0" border="0"
                                                 cellspacing="0" style="min-width:590px;" name="Layout_3971" id="Layout_3971">
                                                 <tbody>
                                                     <tr>
                                                         <td class="rnb-del-min-width" valign="top" align="center"
                                                             style="min-width:590px;">
                                                             <table width="100%" cellpadding="0" border="0" height="38"
                                                                 cellspacing="0">
                                                                 <tbody>
                                                                     <tr>
                                                                         <td valign="top" height="38">
                                                                             <img width="20" height="38"
                                                                                 style="display:block; max-height:38px; max-width:20px;"
                                                                                 alt=""
                                                                                 src="http://img.mailinblue.com/new_images/rnb/rnb_space.gif">
                                                                         </td>
                                                                     </tr>
                                                                 </tbody>
                                                             </table>
                                                         </td>
                                                     </tr>
                                                 </tbody>
                                             </table>
                                         </td>
                                     </tr>
                                 </tbody>
                             </table>
                             <!--[if gte mso 9]>
                                 </td>
                                 </tr>
                                 </table>
                                 <![endif]-->
                         </td>
                     </tr>
                 </tbody>
             </table>
     
         </body>
     
         </html>`;

            let imageLogo = 'https://img.mailinblue.com/2598720/images/rnb/original/5e47eadb9967ccbc76710418.png';
            if (isAccount && user.account_image) {
                imageLogo = await GetSignUrl(user.account_image);
            } else if (user.toJSON().branch.account.image) {
                imageLogo = await GetSignUrl(user.toJSON().branch.account.image);
            }

            var template = handlebars.compile(reSetHTML);
            var replacements = {
                name: isAccount ? user.account_title : user.toJSON().name,
                urlToken: urlToken,
                logo: imageLogo,
                emailId: user.account_email
            };

            var htmlToSend = template(replacements);

            var emailInfo = {};
            if (isAccount) {
                emailInfo = {
                    from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
                    to: '"' + user.account_title + '" ' + user.account_email,
                    subject: 'Reset your Password',
                    html: htmlToSend
                }
            } else {

                user = user.toJSON();

                emailInfo = {
                    from: '"platform.example.com" ' + CONFIG.SMTP_UserEmail,
                    to: '"' + user.name + '" ' + user.email,
                    subject: 'Reset your Password',
                    html: reSetHTML
                }
            }

            let info = await to(transporter.sendMail(emailInfo));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Password reset link sent successfully.');

        } else {

            return ReE(res, 'Please enter valid email id.', 422);
        }
    }
}

//
module.exports.getPermissionsList = async function (req, res) {

    const accountId = req.user.account_id;

    [err, activePlan] = await to(authService.getActivePlanDetail(accountId));
    if (err) return ReE(res, err, 422);
    if (activePlan) {

        const planId = activePlan.toJSON().plan_id;
        [err, activePlanMenuList] = await to(authService.getPlanMenuSubMenuList(6));
        if (err) return ReE(res, err, 422);

        var allPermissionList = [];

        await Promise.all(activePlanMenuList.map(async (permission) => {

            var permissionJson = permission.toJSON();


            [err, menuDetail] = await to(menuService.getMenuSubMenuFor(permissionJson.menuPermissions, permissionJson.subMenuPermissions));
            if (err) return ReE(res, err, 422);
            if (menuDetail) {

                allPermissionList.push(menuDetail);
            }
        }));

        const responseJson = { menuPermissions: allPermissionList };
        return ReS(res, 'Permission Get Successfully.', responseJson);

    } else {

        return ReE(res, 'Failed to load permission.', 422);
    }
}

// Update Institute Password
module.exports.updatePassword = async function (req, res) {

    const body = req.fields;
    if (!body.password) {

        return ReE(res, 'Please enter password', 422);

    } else {

        if (req.user.userType == 3) {

            [err, user] = await to(authServiceTutor.getTutor(req.user.id));
            if (err) return ReE(res, err, 422);
            if (user) {
                const userInfo = {

                    tutor_password: sha1(body.password),
                    update_ip: req.ip
                };

                [err, userRes] = await to(authServiceTutor.updateTutor(req.user.id, userInfo));
                if (err) return ReE(res, err, 422);

                if (userRes.length == 1 && userRes[0] == 1) {

                    [err, deletedDevice] = await to(authService.deleteAllLogedDevice(req.user.account_id, req.user.id, 'tutor'));
                    return ReS(res, 'Password updated successfully.');

                } else {

                    return ReE(res, 'Failed to update password, please try again.', 422);
                }
            } else {

                return ReE(res, 'User not found.', 422);
            }
        } else {

            [err, user] = await to(authService.getUserObj(req.user.account_id));
            if (err) return ReE(res, err, 422);
            if (user) {

                const userInfo = {

                    account_password: sha1(body.password),
                    update_ip: req.ip
                };

                [err, userRes] = await to(authService.updateUser(req.user.account_id, userInfo));
                if (err) return ReE(res, err, 422);

                if (userRes.length == 1 && userRes[0] == 1) {

                    [err, deletedDevice] = await to(authService.deleteAllLogedDevice(req.user.account_id, req.user.account_id, 'institute'));
                    return ReS(res, 'Password updated successfully.');

                } else {

                    return ReE(res, 'Failed to update password, please try again.', 422);
                }

            } else {

                return ReE(res, 'User not found.', 422);
            }
        }

    }
}

module.exports.cancelSubscription = async function (req, res) {

    [err, user] = await to(authService.getUser(req.user.account_id));
    if (err) return ReE(res, err, 422);
    if (user) {

        if (user.razerPaySubscriptionId) {

            var instance = new Razorpay({
                key_id: 'rzp_test_XXXXXXXXXXXXXX',
                key_secret: 'AMdsn4XJ03YF01AKJdnIZkdA'
            });

            // var instance = new Razorpay({
            //    key_id: 'rzp_live_XXXXXXXXXXXXXX',
            //    key_secret: '59n16eicaK7BsXVApTsg2EXz'
            // });

            const params = { cancel_at_cycle_end: 1 };
            [err, response] = await toWithout(instance.subscriptions.cancel(user.razerPaySubscriptionId, true));
            if (err) return ReE(res, err.error.description, 422);

            const userInfo = { razerPaySubscriptionId: null };
            [err, user] = await to(authService.updateUser(req.user.account_id, userInfo));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'Subscription cancelled successfully.', response);

        } else {

            return ReE(res, 'You don\'t have any subscription.', 422);
        }

    } else {

        return ReE(res, 'User not found.', 422);
    }
}

module.exports.getUsedSpace = async function (req, res) {

    var bucketName = 'edtech-platformdevelopment';
    if (CONFIG.port == 3000) {
        bucketName = 'toa-data';
    }
    let command = "aws s3 ls s3://" + bucketName + "/" + req.user.account_id + " --recursive | awk 'BEGIN {total=0}{total+=$3}END{print total/1024/1024/1024}'"

    exec(command, function (error, stdout, stderr) {
        if (error) {

            return ReE(res, 'Failed to get space, please try again.', 422);

        } else if (stdout) {

            var splaceString = stdout.replace("\n", "");
            return ReS(res, 'Used space get successfully', { usedSpace: splaceString });

        } else {

            return ReE(res, 'Failed to get space, please try again.', 422);
        }
    });


}

// add time zone
module.exports.updateTimeZone = async function (req, res) {

    const body = req.fields;

    if (!body.timeZone) ReE(res, 'Please select time zone', 422);

    const timeZone = {
        time_zone: body.timeZone
    }

    let id = req.user.account_id;
    [err, account] = await to(authService.updateAccount(timeZone, id));
    if (err) return ReE(res, err, 422);

    if (account[0] == 0) TE('Failed to update time Zone');
    return ReS(res, 'Time zone updated successfully');

}

// update default currency
module.exports.updateCurrency = async function (req, res) {

    const body = req.fields;

    if (!body.currencyId) ReE(res, 'Please select currency', 422);

    const accountJson = {
        currency_id: body.currencyId
    }

    let id = req.user.account_id;
    [err, account] = await to(authService.updateAccount(accountJson, id));
    if (err) return ReE(res, err, 422);

    if (account[0] == 0) TE('Failed to currency');
    return ReS(res, 'Currency updated successfully');

}




//-------------------- Update Domain --------------------//

module.exports.updateDomain = async function (req, res) {

    const body = req.fields;

    if (!body.domain) ReE(res, 'Please enter domain', 422);

    const account_domain = {
        account_domain: body.domain
    }
    let domain = body.domain;
    let id = req.user.account_id;

    [err, account] = await to(authService.updateDomain(account_domain, domain, id));
    if (err) return ReE(res, err, 422);


    if (account[0] == 0) TE('Failed to update domain');
    return ReS(res, 'Domain updated successfully');

}