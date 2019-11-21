const { TOA_account, TOA_city, TOA_country, TOA_Tutor_menu_plan_permission, TOA_plan_purchase, TOA_account_log, TOA_term, TOA_plan, TOA_plan_detail, TOA_admin_paymentgateway, TOA_offer, TOA_gateway_type, TOA_login_device, TOA_currency } = require('../../../models');
const validator = require('validator');
const { to, TE, ReE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const updateUser = async function (accountId, userInfo) {

    [err, user] = await to(TOA_account.update(userInfo, { where: { account_id: accountId } }));
    if (err) TE(err.message);
    return user;
}
module.exports.updateUser = updateUser;

const getUserObj = async function (accountId) {

    [err, user] = await to(TOA_account.findOne({ where: { account_id: accountId } }));
    if (err) TE(err.message);
    return user;
}
module.exports.getUserObj = getUserObj;

module.exports.getAccountBySubscriptionId = async function (subscriptionId) {

    [err, user] = await to(TOA_account.findOne({ where: { razerPaySubscriptionId: subscriptionId } }));
    if (err) TE(err.message);
    return user;
}


const getUser = async function (accountId) {

    [err, user] = await to(TOA_account.findOne(
        {
            where: { account_id: accountId, status: 0, delete: 0 },
            include: [
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
            ]
        }));
    if (err) TE(err.message);
    return user;
}
module.exports.getUser = getUser;

const userExist = async function (email, phone) {

    [err, users] = await to(TOA_account.findAll({ where: { [Op.or]: [{ account_email: email }] } }));
    if (err) TE(err.message);
    return users;
}
module.exports.userExist = userExist;


// Invoice Related Operations
const getLastInvoice = async function (accountId) {

    [err, plan] = await to(TOA_plan_purchase.findOne({

        where: { account_id: accountId },
        order: [['updatedAt', 'DESC']],
        attributes: [['plan_purchase_id', 'id'], ['plan_title', 'title'], ['plan_gst', 'gst'], ['plan_amount', 'amount'], ['plan_sdate', 'startDate'], ['plan_edate', 'endDate']],
        include: [
            {

                model: TOA_term,
                as: 'term',
                attributes: [['term_id', 'id'], ['term_title', 'title']]
            },
            {
                model: TOA_offer,
                as: 'appledOffer',
                attributes: [['offer_id', 'id'], ['offer_title', 'title'], ['offer_discount', 'discount'], ['offer_max_amount', 'maxAmount'], 'maxDollerAmount']
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
                required: false,
            }
        ]
    }));
    if (err) TE(err.message);
    return plan;
}
module.exports.getLastInvoice = getLastInvoice;


// Authenticate User and return the User Object.
module.exports.authUser = async function (userInfo) {

    [err, user] = await to(TOA_account.findOne({
        // where: { account_phone: userInfo.phone, status: 0, delete: 0 },
        where: { [Op.or]: [{ account_phone: userInfo.phone }, { account_email: userInfo.phone }], status: 0, delete: 0 },
        include: [
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
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'code', 'sign'],
                required: false,
            }
        ]
    }));

    if (err) TE(err.message);
    if (!user) TE('Invalid Credentials. Please try again.');


    [err, user] = await to(user.comparePassword(userInfo.password));
    if (err) TE(err.message);

    return user;

}


// admin operation to add and check plan
const addNewPlan = async function (plan) {


    [err, purchasesPlan] = await to(TOA_plan_purchase.create(plan));
    if (err) TE(err.message);

    return purchasesPlan;
}
module.exports.addNewPlan = addNewPlan;

module.exports.checkPlan = async function (account_id) {

    [err, purchasesPlan] = await to(TOA_plan_purchase.findAll({
        where: { account_id: account_id, status: 0, delete: 0 },
        attributes: ['term_id', 'plan_id', 'plan_title', 'plan_sdate', 'plan_edate'],
        order: [['createdAt', 'ASC']],
    }));
    if (err) null;

    if (purchasesPlan.length > 0) {
        return purchasesPlan[(purchasesPlan.length - 1)];
    } else {
        return null;
    }

}


// add log of login
const addLoginEntry = async function (user, login_ip) {

    let loginEntry = { account_id: user.account_id, login_ip: login_ip };
    [err, loginEntry] = await to(TOA_account_log.create(loginEntry));
    if (err) TE('Please enter email and password to login');
    if (!loginEntry) TE('Please enter email and password to login');
    return loginEntry;
}
module.exports.addLoginEntry = addLoginEntry;


// Get all plans and bank list
module.exports.getAllTermsAndPlan = async function () {

    [err, users] = await to(TOA_term.findAll(
        {

            where: { status: 0, delete: 0 },
            attributes: [['term_id', 'id'], ['term_title', 'title'], ['term_month', 'month'], ['term_days', 'days']],
            order: [[{ model: TOA_plan, as: 'plan' }, 'plan_amount', 'ASC']],
            include: [{

                model: TOA_plan,
                where: { status: 0, delete: 0 },
                as: 'plan',
                attributes: [['plan_id', 'id'], 'term_id', ['plan_title', 'title'], ['plan_amount', 'amount'], ['plan_amount_usd', 'amountUSD']],

                include: [{

                    model: TOA_plan_detail,
                    where: { status: 0, delete: 0 },
                    as: 'plan_detail',
                    attributes: [['plan_detail_id', 'id'], ['plan_id', 'plan_id'], 'term_id', ['plan_detail_title', 'title']],
                }]

            }]
        }
    ));
    if (err) TE(err.message);
    return users;
}


const getBankList = async function () {

    [err, bankList] = await to(TOA_admin_paymentgateway.findAll({
        where: { status: 0, delete: 0 },
        attributes: ['id', ['gateway_value', 'value']],
        include: [{

            model: TOA_gateway_type,
            where: { status: 0, delete: 0 },
            as: 'paymentGateWay',
            attributes: ['id', 'name'],
        }]
    }));
    if (err) TE(err.message);
    return bankList;
}
module.exports.getBankList = getBankList;


// Offer related api's
const getOffer = async function (offerId, termId) {

    [err, offer] = await to(TOA_offer.findOne({

        where: { term_id: termId, offer_id: offerId, status: 0, delete: 0 },
        attributes: [['offer_id', 'id'], ['offer_title', 'title'], ['offer_code', 'code'], ['offer_discount', 'discount'], ['offer_max_amount', 'maxAmount'], 'maxDollerAmount', 'offer_sdate', 'offer_edate']

    }));

    if (err) TE(err.message);
    return offer.toWeb();
}
module.exports.getOffer = getOffer;

const checkAccountOffer = async function (termId, offerCode) {

    [err, offer] = await to(TOA_offer.findOne({

        where: { term_id: termId, offer_code: offerCode, status: 0, delete: 0 },
        attributes: [['offer_id', 'id'], ['offer_title', 'title'], ['offer_code', 'code'], ['offer_discount', 'discount'], ['offer_max_amount', 'maxAmount'], 'maxDollerAmount', 'offer_sdate', 'offer_edate']

    }));

    if (err) TE(err.message);

    if (offer) {


        const startDate = new Date(offer.offer_sdate).getTime();
        const endDate = new Date(offer.offer_edate).getTime();
        const currentDate = new Date().getTime();

        if (currentDate > startDate && currentDate < endDate) {

            return offer;
        }
        else {

            return TE('Offer Expired');
        }

    } else {

        return TE('Offer not found');
    }

}
module.exports.checkAccountOffer = checkAccountOffer;

// All Invoice List
const getInvoiceList = async function (accountId) {

    [err, invoiceList] = await to(TOA_plan_purchase.findAll({

        where: { account_id: accountId },
        order: [['updatedAt', 'DESC']],
        attributes: [['plan_purchase_id', 'id'], ['plan_title', 'title'], ['plan_gst', 'gst'], ['plan_amount', 'amount'], ['plan_sdate', 'startDate'], ['plan_edate', 'endDate'], 'gateway_id'],
        include: [
            {

                model: TOA_term,
                as: 'term',
                attributes: [['term_id', 'id'], ['term_title', 'title']]
            },
            {
                model: TOA_offer,
                as: 'appledOffer',
                attributes: [['offer_id', 'id'], ['offer_title', 'title'], ['offer_discount', 'discount'], ['offer_max_amount', 'maxAmount'], 'maxDollerAmount']
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
                required: false,
            }
        ]
    }));
    if (err) TE(err.message);
    return invoiceList;
}
module.exports.getInvoiceList = getInvoiceList;


// Send Forgot password link
module.exports.forGotPasswordReset = async function (emailId) {

    [err, user] = await to(TOA_account.findOne({ where: { account_email: emailId } }));
    if (err) TE(err.message);
    return user;
}


module.exports.getActivePlanDetail = async function (accountId) {

    [err, activePlan] = await to(TOA_plan_purchase.findOne({

        where: { account_id: accountId },
        order: [['updatedAt', 'DESC']],

    }));
    if (err) TE(err.message);
    return activePlan;
}


module.exports.getPlanMenuSubMenuList = async function (planId) {


    [err, menuList] = await to(TOA_Tutor_menu_plan_permission.findAll({
        where: { plan_id: planId },
        attributes: ['plan_id', 'menuPermissions', 'subMenuPermissions'],

    }));
    if (err) TE(err.message);
    return menuList;

}

// Adding logedin device id
module.exports.storeLogedDevice = async function (deviceJson) {

    [err, device] = await to(TOA_login_device.findOne({ where: { webDeviceId: deviceJson.webDeviceId } }));
    if (!device) {
        [err, logedDevice] = await to(TOA_login_device.create(deviceJson));
        if (err) TE(err.message);
        return;
    }
    return;
}

// delete device from logedin
module.exports.deleteLogedDevice = async function (deviceId) {

    [err, deletedDevice] = await to(TOA_login_device.destroy({ where: { webDeviceId: deviceId } }));
    if (err) TE(err.message);
    return deletedDevice;

}

// delete all loged device
module.exports.deleteAllLogedDevice = async function (accountId, userId, type) {

    [err, deletedDevice] = await to(TOA_login_device.destroy({ where: { typeId: accountId, type: type, userId: userId } }));
    if (err) TE(err.message);
    return deletedDevice;

}

// update timezone
const updateAccount = async function (accountJson, accountId) {

    [err, account] = await to(TOA_account.update(accountJson, { where: { account_id: accountId } }));
    if (err) TE(err.message);
    return account;
}
module.exports.updateAccount = updateAccount;



// update domain
module.exports.updateDomain = async function (accountJson, domain, accountId) {

    [err, sameuser] = await to(TOA_account.findOne({
        where: {
            [Op.and]: [{ account_id: accountId }, { account_domain: domain }]
        }
    }));

    if (sameuser) {
        [err, sameaccount] = await to(TOA_account.update(accountJson, { where: { account_id: accountId } }));
        if (err) TE(err.message);
        return sameaccount;
    } else {

        [err, users] = await to(TOA_account.findOne({
            where: {
                [Op.or]: [{ account_domain: domain }]
            }
        }));

        if (users) {
            return TE('Domain already exist.', 422);
        };

        [err, account] = await to(TOA_account.update(accountJson, { where: { account_id: accountId } }));
        if (err) TE(err.message);
        return account;

    }
}