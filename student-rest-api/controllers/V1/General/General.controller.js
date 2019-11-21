const generalService = require('../../../services/V1/General/General.service');
const authServiceIns = require('../../../services/V1/Institute/auth.service');
const superAdminService = require('../../../services/V1/Superadmin/superadmin.service');
const branachService = require('../../../services/V1/Institute/branch.service');
const tutorService = require('../../../services/V1/Institute/tutor.service');
const planService = require('../../../services/V1/Superadmin/plan.service');
const { createSubDomain } = require('../../../services/V1/createsubdomain.service');
const CONFIG = require('../../../config/config');
const CryptoJS = require("crypto-js");
const {
    to,
    toWithout,
    ReE,
    ReS,
    UploadImage,
    GetSignUrl,
    RegisterInstituteInSIB,
    InstituteFolderInSIB,
    SendInstituteRegisterEMail,
    SendTextMessage,
    SendMailUsingTOA,
    SendOtpEmail
} = require('../../../services/V1/util.service');

const { GetChargeBeePayURL } = require('../../../services/V1/ChargeBee.service');

const sha1 = require('sha1');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const Razorpay = require('razorpay')
const moment = require('moment');
const { v1 } = require('uuid');

const chargebee = require("chargebee");


// Get all Country and Cities List
module.exports.countryCityList = async function (req, res) {

    [err, countryCityList] = await to(generalService.countryCityList());
    if (err) return ReE(res, err, 422);
    return ReS(res, 'Country state listed successfully..', countryCityList);

}

module.exports.baseUrl = async function (req, res) {

    var data = {
        devUrl: 'http://api.learnonapp.in:5000/',
        liveUrl: 'https://api.example.com/'
    }
    // var baseUrl = 'https://api.example.com/';
    // baseUrl = https://api.example.com:3000/
    return ReS(res, 'Base Url got successfully', data);

}

// Create new institute from Website.
module.exports.addNewInstitute = async function (req, res) {

    const body = req.fields;


    if (!body.title) {

        return ReE(res, 'Please enter institute name.', 422);

    } else if (!body.email) {

        return ReE(res, 'Please enter email id.', 422);

    } else if (!body.password) {

        return ReE(res, 'Please enter password.', 422);

    } else if (!body.domain) {

        return ReE(res, 'Please enter domain.', 422);

    } else {
        var isMarketplaceEnable = true;
        if (body.isMarketplaceEnable != null) {

            isMarketplaceEnable = body.isMarketplaceEnable;
        }

        var accessLevel = 2;
        if (body.accessLevel) {
            accessLevel = body.accessLevel;
        }

        [err, users] = await to(superAdminService.userExist(body.email));
        if (users) {

            return ReE(res, 'Email already exist. please use different email.', 422);
        }


        //domain checkout
        [err, users] = await to(superAdminService.domainExist(body.domain));
        if (users) {
            return ReE(res, 'Domain exist. please try to login.', 422);
        }

        //domain checkout
        [err, users] = await to(superAdminService.domainExist(body.domain));
        if (users) {
            return ReE(res, 'Domain exist. please try to login.', 422);
        }

        // [err, users] = await to(branachService.userExist(body.email));
        // if (users) {

        //     return ReE(res, 'Email already exist. please use different email.', 422);
        // }

        [err, users] = await to(tutorService.userExist(body.email));
        if (users) {

            return ReE(res, 'Email already exist. please use different email.', 422);
        }


        // [err, ins] = await to(RegisterInstituteInSIB(body.email, body.title));
        // if (err) return ReE(res, 'Your email does not recognize, please change your e-mail address. ', 422);

        // [err, folder] = await to(InstituteFolderInSIB(body.title));
        // if (err) return ReE(res, 'Your email does not recognize, please change your e-mail address.', 422);


        var imageBuffer = fs.readFileSync(CONFIG.STATCI_FILES + 'ic_platform_logo.png');
        var name = (new Date().getTime().toString()) + '_' + 'ic_platform_logo.png';
        if (req.files.image != null) {
            imageBuffer = fs.readFileSync(req.files.image.path);
            name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        }

        [err, s3Bucket] = await to(UploadImage('user', name, imageBuffer));
        if (err) return ReE(res, 'Failed to create user. please try gain.', 422);

        const UUID = v1();
        const CODE = UUID.split("-")[0];

        let userInfo = {

            UUID: UUID,
            CODE: CODE,
            account_image: s3Bucket.Key,
            account_title: body.title,
            countryCode: body.countryCode,
            country_id: body.countryId,
            currency_id: body.currencyId ? body.currencyId : 2,
            city_id: body.cityId,
            pin_code: body.pinCode,
            account_phone: body.phone,
            account_email: body.email,
            account_password: sha1(body.password),
            account_domain: !body.domain ? '' : body.domain,
            account_apikey: 'AAAANtS12RA:APA91bGJmyxc1fiIJZFY8c2eMoFKyBBGKoLNCmzwqWWoxzRKVQfNVG-Et1DhkljdOvmt7eO2ciToxYlRxLWqaL9jxzfPmpe5dgR6CibiNufbjXWwUWWBFpVjForLJ6-ZC4ejPK-_gubs',
            // sib_folder_id: folder.id,
            is_marketplace_enable: isMarketplaceEnable,
            accessLevel: accessLevel,
            create_ip: req.ip,
        };

        [err, user] = await to(superAdminService.createUser(userInfo));
        if (err) return ReE(res, err, 422);

        [err, response] = await to(createSubDomain(userInfo.account_title,userInfo.account_domain));

        let branchBody = {
            UUID: UUID,
            CODE: CODE,
            account_id: user.account_id,
            branch_name: body.title,
            contactCountryCode: body.countryCode,
            branch_number: body.phone,
            branch_email: body.email,
            password: sha1('12345'),//sha1(body.password),
            branch_address: body.title,
            country_id: body.countryId,
            city_id: body.cityId,
            pincode: body.pinCode,
            billingAddress: (body.billingAddress != null && body.billingAddress != '') ? body.billingAddress : null,
            panNumber: (body.panNumber != null && body.panNumber != '') ? body.panNumber : null,
            gstNumber: (body.gstNumber != null && body.gstNumber != '') ? body.gstNumber : null,
            branch_latitude: body.latitude,
            branch_longitude: body.longitude,
            create_ip: req.ip,
        };

        [err, branch] = await to(branachService.addBranch(branchBody));

        if (user != null) {

            [err, info] = await to(SendInstituteRegisterEMail(body.email, body.title));
            if (err) return ReE(res, err, 422);

            [err, user] = await to(superAdminService.getAInstitute(user.account_id));
            if (err) return ReE(res, err, 422);

            let res_user = user.toWeb();
            res_user.bearer_token = user.getJWT();
            res_user.account_password = null;
            res_user.account_image = await GetSignUrl(res_user.account_image);

            return ReS(res, 'Thank you for being part of our platform.', res_user);

        } else {

            return ReS(res, 'Failed to add.please try again.');
        }
    }
}

module.exports.generateJWTToken = async function (req, res) {

    const payload = {
        iss: 'YOUR_ZOOM_API_KEY',
        exp: ((new Date()).getTime() + 5000)
    };

    //Automatically creates header, and returns JWT
    const token = jwt.sign(payload, 'YOUR_ZOOM_API_SECRET');
    return ReS(res, 'JWT Token generated Successfully.', {
        token: token
    });
}

module.exports.getMeetingSignature = async function (req, res) {

    const body = req.fields;

    if (body.branchId != null && body.meetingNumber != null && body.role != null) {

        [err, liveClassKeyList] = await to(generalService.getLiveClassKeys(body.branchId));
        if (err) return ReE(res, 'Required param not found.', 412);
        if(liveClassKeyList.length == 0) return ReE(res, 'Required param not found.', 412);

        let key = CryptoJS.AES.decrypt(liveClassKeyList[0].toJSON().key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        let secret = CryptoJS.AES.decrypt(liveClassKeyList[0].toJSON().secret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

        const timestamp = (new Date().getTime() - 30000);
        const msg = Buffer.from(key + body.meetingNumber + timestamp + body.role).toString('base64');
        const hash = crypto.createHmac('sha256', secret).update(msg).digest('base64');
        const signature = Buffer.from(`${key}.${body.meetingNumber}.${timestamp}.${body.role}.${hash}`).toString('base64');

        return ReS(res, 'Signature Generated Successfully.', { signature: signature });

    } else {

        return ReE(res, 'Required param not found.', 412);
    }
}

module.exports.sendTextMessage = async function (req, res) {

    const body = req.fields;
    if (req.headers.accounttype != '[API_KEY]') {

        return ReE(res, 'Account not valid.', 422);

    } else if (!body.phone) {

        return ReE(res, 'Please enter email number.', 422);

    } else if (!body.textMessage) {

        return ReE(res, 'Please enter text message.', 422);

    } else {
        // [err, response] = await to(SendTextMessage(body.phone, body.textMessage));
        [err, info] = await to(SendOtpEmail(body.phone, body.textMessage));

        if (err) return ReE(res, 'Failed to send message, please try again.', 422);
        return ReS(res, 'Message send successfully.');
    }
}

module.exports.generateSubscription = async function (req, res) {

    const body = req.fields;
    if (!body.planId) {

        return ReE(res, 'Please select plan.', 422);

    } else {

        [err, plan] = await to(planService.getPlan(body.planId));
        if (err) return ReE(res, err, 422);
        if (plan) {
            // var instance = new Razorpay({
            //     key_id: 'rzp_test_XXXXXXXXXXXXXX',
            //     key_secret: 'AMdsn4XJ03YF01AKJdnIZkdA'
            // });
            let planObj = plan.toJSON();

            var instance = new Razorpay({
                key_id: 'rzp_live_XXXXXXXXXXXXXX',
                key_secret: '59n16eicaK7BsXVApTsg2EXz'
            });

            const params = {
                plan_id: plan.razerPayPlanId,
                total_count: planObj.term.id == 2 ? 1 : 12,
            };

            [err, response] = await toWithout(instance.subscriptions.create(params));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Subscription created successfully.', response);
        } else {
            return ReE(res, 'Plan not found.', 422);
        }

    }
}

module.exports.razerPaySubscription = async function (req, res) {

    var body = req.fields;

    if (body.event == 'subscription.charged') {

        const subscription = body.payload.subscription.entity;
        const payment = body.payload.payment.entity;

        [err, account] = await to(authServiceIns.getAccountBySubscriptionId(subscription.id));

        if (account) {

            const accountJSON = account.toJSON();

            [err, plan] = await to(planService.getPlanByPlanId(subscription.plan_id));

            if (err) {
                return ReE(res, 'Failed To purchase. please try again plan', 422);
            }

            if (!plan) {
                return ReE(res, 'Failed To purchase. please try again plan', 422);
            }

            let planObj = plan.toJSON();

            [err, term] = await to(planService.getTerm(planObj.term.id));
            if (err) {
                return ReE(res, 'Failed To purchase. please try again term', 422);
            }

            if (!term) {

                return ReE(res, 'Failed To purchase. please try again plan', 422);
            }

            [err, invoiceList] = await to(authServiceIns.getInvoiceList(accountJSON.account_id));
            if (err) return ReE(res, err, 422);


            var dummyStartDate = moment();
            var lastInvoice = null;

            if (invoiceList.length > 0) {

                lastInvoice = invoiceList[0].toJSON();
                var endingDate = moment(lastInvoice.endDate);

                if (endingDate.isSameOrAfter(dummyStartDate)) {
                    dummyStartDate = endingDate.add(1, 'days');
                }
            }
            let termObj = term.toWeb();

            var planPurchase = {
                account_id: accountJSON.account_id,
                term_id: termObj.id,
                plan_id: planObj.id,
                plan_gst: (lastInvoice != null) ? lastInvoice.gst : 18,
                gateway_id: (lastInvoice != null) ? lastInvoice.gateway_id : 1,
                transaction_id: payment.id,
                plan_title: planObj.title,
                plan_amount: planObj.amount,
                currencyType: 1,
                create_ip: req.ip
            };

            planPurchase.plan_sdate = dummyStartDate.format('YYYY-MM-DD');

            var planEndDate = dummyStartDate;
            planEndDate = planEndDate.add(termObj.days, 'days');

            planPurchase.plan_edate = planEndDate.format('YYYY-MM-DD');

            [err, purchasedPlan] = await to(authServiceIns.addNewPlan(planPurchase));

            if (err) ReE(res, err.message, 422);
            if (purchasedPlan) {

                if (planObj.subject_title && planObj.mail_content) {

                    [err, info] = await to(SendMailUsingTOA(accountJSON.account_title, accountJSON.account_email, planObj.subject_title, planObj.mail_content));
                }
                return ReS(res, 'Plan purchase successfully.', purchasedPlan);

            } else {

                return ReE(res, 'Please select plan.', 422);
            }
        }
    }
    return ReS(res, 'Subscription charged successfully.', body);
}

// Chargebee Subscription
module.exports.chargebeeSubscription = async function (req, res) {

    var body = req.fields;

    chargebee.configure({
        site: CONFIG.chargebeesite,
        api_key: CONFIG.chargebeeapikey
    })

    if (!body.account_id) {

        return ReE(res, 'Please enter account id.', 422);

    } else if (!body.plan_id) {

        return ReE(res, 'Please enter plan id.', 422);

    } else if (!body.auto_collection) {

        return ReE(res, 'Please enter auto collection.', 422);

    } else if (!body.billing_address) {

        return ReE(res, 'Please enter billing address.', 422);

    } else {

        [err, account] = await to(authServiceIns.getUser(body.account_id));

        if (account) {
            const accountJSON = account.toJSON();

            [err, plan] = await to(planService.getPlanByPlanId(body.plan_id));

            if (err) {
                return ReE(res, 'Failed To purchase. please try again plan', 422);
            }
            if (!plan) {
                return ReE(res, 'Failed To purchase. please try again plan', 422);
            }

            let planObj = plan.toJSON();

            [err, term] = await to(planService.getTerm(planObj.term.id));

            if (err) {
                return ReE(res, 'Failed To purchase. please try again term', 422);
            }
            if (!term) {
                return ReE(res, 'Failed To purchase. please try again plan', 422);
            }

            let termObj = term.toWeb();

            var dummyStartDate = moment();

            var planPurchase = {
                account_id: accountJSON.account_id,
                term_id: termObj.id,
                plan_id: planObj.id,
                plan_gst: 18,
                gateway_id: 1,
                // transaction_id: paymentid,
                plan_title: planObj.title,
                plan_amount: planObj.amount,
                currencyType: 1,
                create_ip: req.ip
            };

            planPurchase.plan_sdate = dummyStartDate.format('YYYY-MM-DD');

            var planEndDate = dummyStartDate;
            planEndDate = planEndDate.add(termObj.days, 'days');

            planPurchase.plan_edate = planEndDate.format('YYYY-MM-DD');

            let subData = {
                plan_id: body.plan_id,
                auto_collection: body.auto_collection,
                billing_address: {
                    first_name: body.billing_address.first_name,
                    last_name: body.billing_address.last_name,
                    line1: body.billing_address.line1,
                    city: body.billing_address.city,
                    state: body.billing_address.state,
                    zip: body.billing_address.zip,
                    country: body.billing_address.country
                },
                card: {
                    number: body.card.number,
                    expiry_month: body.card.expiry_month,
                    expiry_year: body.card.expiry_year,
                    cvv: body.card.cvv,
                    gateway: body.card.gateway
                }
            }

            chargebee.subscription.list({
                "plan_id[in]": `["${body.plan_id}"]`,
                "customer_id[is]": `${accountJSON.account_id}`,
                "status[is]": "active"
            }).request(function (error, result) {
                if (error) {
                    return ReE(res, error, 422);
                } else {
                    if (result.list.length > 0) {
                        return ReE(res, 'Already subscribed to plan.', 422);
                    } else {

                        chargebee.customer.retrieve(`${accountJSON.account_id}`).request(function (error, result) {
                            if (error) {
                                if (error.message == "Sorry, we couldn't find that resource") {

                                    subData.customer = {
                                        id: accountJSON.account_id,
                                        first_name: accountJSON.account_title,
                                        email: accountJSON.account_email
                                    }

                                    chargebee.subscription.create(subData).request(async function (error, result) {
                                        if (error) {
                                            return ReE(res, error, 422);
                                        } else {

                                            [err, purchasedPlan] = await to(authServiceIns.addNewPlan(planPurchase));

                                            if (err) ReE(res, err.message, 422);

                                            if (purchasedPlan) {
                                                if (planObj.subject_title && planObj.mail_content) {
                                                    [err, info] = await to(SendMailUsingTOA(accountJSON.account_title, accountJSON.account_email, planObj.subject_title, planObj.mail_content));
                                                }
                                                return ReS(res, 'Plan purchase successfully.', purchasedPlan);
                                            } else {
                                                return ReE(res, 'Please select plan.', 422);
                                            }
                                        }
                                    });

                                } else {
                                    return ReE(res, error, 422);
                                }
                            } else {

                                chargebee.subscription.create_for_customer(`${accountJSON.account_id}`, subData)
                                    .request(async function (error, result) {
                                        if (error) {
                                            return ReE(res, error, 422);
                                        } else {

                                            [err, purchasedPlan] = await to(authServiceIns.addNewPlan(planPurchase));

                                            if (err) ReE(res, err.message, 422);

                                            if (purchasedPlan) {
                                                if (planObj.subject_title && planObj.mail_content) {
                                                    [err, info] = await to(SendMailUsingTOA(accountJSON.account_title, accountJSON.account_email, planObj.subject_title, planObj.mail_content));
                                                }
                                                return ReS(res, 'Plan purchase successfully.', purchasedPlan);
                                            } else {
                                                return ReE(res, 'Please select plan.', 422);
                                            }
                                        }
                                    });

                            }
                        });

                    }
                }
            });

        }
    }
}

// Renew Subscription
module.exports.renewSubscription = async function (req, res, data) {

    let subData = data;

    let subscriptionData = subData.content.subscription;
    let customerData = subData.content.customer;

    customerData.id = 48;
    subscriptionData.plan_id = "basic";

    [err, account] = await to(authServiceIns.getUser(customerData.id));

    if (account) {
        const accountJSON = account.toJSON();

        [err, plan] = await to(planService.getPlanByPlanId(subscriptionData.plan_id));

        if (err) {
            return ReE(res, 'Failed To renew. please try again plan', 422);
        }
        if (!plan) {
            return ReE(res, 'Failed To renew. please try again plan', 422);
        }

        let planObj = plan.toJSON();

        [err, term] = await to(planService.getTerm(planObj.term.id));

        if (err) {
            return ReE(res, 'Failed To renew. please try again term', 422);
        }
        if (!term) {
            return ReE(res, 'Failed To renew. please try again plan', 422);
        }

        let termObj = term.toWeb();
        var dummyStartDate = moment();

        var planPurchase = {
            account_id: accountJSON.account_id,
            term_id: termObj.id,
            plan_id: planObj.id,
            plan_gst: 18,
            gateway_id: 1,
            // transaction_id: payment.id,
            plan_title: planObj.title,
            plan_amount: planObj.amount,
            currencyType: 1,
            create_ip: req.ip
        };

        planPurchase.plan_sdate = dummyStartDate.format('YYYY-MM-DD');

        var planEndDate = dummyStartDate;
        planEndDate = planEndDate.add(termObj.days, 'days');

        planPurchase.plan_edate = planEndDate.format('YYYY-MM-DD');

        [err, purchasedPlan] = await to(authServiceIns.addNewPlan(planPurchase));

        if (err) ReE(res, err.message, 422);

        if (purchasedPlan) {
            return purchasedPlan;
        } else {
            return ReE(res, 'Please select plan.', 422);
        }
    }

}

module.exports.getChargeBeeUrl = async function (req, res) {

    [err , chargeBeeUrl] = await to(GetChargeBeePayURL('basic-monthly'));
    if (err) return ReS(res, err, 422);
    return ReS(res, chargeBeeUrl, 200);

}

module.exports.chargebeeSubscriptionWebHook = async function (req, res) {

}
