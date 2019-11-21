const { TOA_account, TOA_Admin, TOA_city, TOA_country, TOA_plan_purchase, TOA_branch , TOA_email_template } = require('../../../models');
const { to, TE } = require('../util.service');
const validator = require('validator');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// Creating new user
const createAdmin = async function (userInfo) {

    [err, user] = await to(TOA_Admin.create(userInfo));
    if (err) TE(err.message);
    if (!user) TE('Failed to create user please try again');

    return user;
}
module.exports.createAdmin = createAdmin;

// Authenticate User and return the User Object.
const authUser = async function (userInfo) {

    if (!userInfo.email) TE('Please enter email and password to login.');
    if (!userInfo.password) TE('Please enter email and password to login.');

    let user;

    if (validator.isEmail(userInfo.email)) {

        [err, user] = await to(TOA_Admin.findOne({ where: { email: userInfo.email } }));
        if (err) TE(err.message);

    } else if (validator.isMobilePhone(userInfo.email, 'any')) {

        [err, user] = await to(TOA_Admin.findOne({ where: { phone: userInfo.email } }));
        if (err) TE(err.message);

    } else {

        TE('A valid email or phone number was not entered');
    }

    if (!user) TE('Account not found.');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if (err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;

module.exports.getAccount = async function (accountId) {

    [err, user] = await to(TOA_Admin.findOne(
        {
            where: { id: accountId },
        }));
    if (err) TE(err.message);
    return user;
}

module.exports.updateAccount = async function (accountId, userInfo) {

    [err, user] = await to(TOA_Admin.update(userInfo, { where: { id: accountId } }));
    if (err) TE(err.message);
    return user;
}



// Tutot Related Operations

// Creating new user
const createUser = async function (userInfo) {

    [err, user] = await to(TOA_account.create(userInfo));
    if (err) TE(err.message);
    if (!user) TE('Failed to create user please try again');

    return user;
}
module.exports.createUser = createUser;

// Creating new user
const updateUser = async function (accountId, userInfo) {

    [err, user] = await to(TOA_account.update(userInfo, { where: { account_id: accountId } }));
    if (err) TE(err.message);
    return user;
}
module.exports.updateUser = updateUser;

// Authenticate User and return the User Object.
const getAllUserList = async function () {

    [err, users] = await to(TOA_account.findAll({
        where: { delete: 0 },
        order: [['account_id', 'DESC']],
        attributes: ['account_id', 'account_image', 'account_title', 'countryCode', 'pin_code', 'account_phone', 'account_email', 'account_domain', 'accessLevel', 'status', ['is_marketplace_enable', 'isMarketplaceEnable'], 'createdAt', 'accessToken'],
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
    return users;
}
module.exports.getAllUserList = getAllUserList;


module.exports.getAllUserBranchesList = async function () {

    [err, users] = await to(TOA_branch.findAll());
    if (err) TE(err.message);
    return users;
}

module.exports.updateUserBranches = async function (accountId, userInfo) {

    [err, user] = await to(TOA_branch.update(userInfo, { where: { branch_id: accountId } }));
    if (err) TE(err.message);
    return user;
}



const getAInstitute = async function (accountId) {

    [err, users] = await to(TOA_account.findOne({
        where: { account_id: accountId, delete: 0 },
        attributes: ['account_id', 'account_image', 'account_title', 'countryCode', 'pin_code', 'account_phone', 'account_email', 'account_domain', 'accessLevel', 'status', ['is_marketplace_enable', 'isMarketplaceEnable'], 'notificationToken', 'accessToken'],
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
    return users;
}
module.exports.getAInstitute = getAInstitute;

module.exports.userExist = async function (email) {

    [err, users] = await to(TOA_account.findOne({
        where: {

            [Op.or]: [{ account_email: email }]

        }
    }));
    if (err) TE(err.message);
    return users;
}

module.exports.getInstituteLastPurchasedPlan = async function (account_id) {

    [err, purchasesPlan] = await to(TOA_plan_purchase.findOne({
        where: { account_id: account_id, status: 0, delete: 0 },
        attributes: [['plan_purchase_id', 'id'], ['plan_title', 'title'], ['plan_sdate', 'startDate'], ['plan_edate', 'endDate'], 'createdAt'],
        order: [['plan_purchase_id', 'DESC']],
    }));

    if (err) err;

    return purchasesPlan;
}


module.exports.domainExist = async function (domain) {

    [err, users] = await to(TOA_account.findOne({
        where: {

            [Op.or]: [{ account_domain: domain }]

        }
    }));
    if (err) TE(err.message);
    return users;
}

//Create email template

const createEmailTemplate = async function (templateInfo) {

    [err, template] = await to(TOA_email_template.create(templateInfo));
    if (err) TE(err.message);
    if (!template) TE('Failed to create email template please try again');

    return template;
}
module.exports.createEmailTemplate = createEmailTemplate;


// Get email template 
module.exports.getEmailTemplate = async function (templateId) {

    [err, template] = await to(TOA_email_template.findOne(
        {
            where: { id: templateId },
        }));
    if (err) TE(err.message);
    return template;
}


// Update email template
const updateEmailTemplate = async function (templateId, templateInfo) {

    [err, template] = await to(TOA_email_template.update(templateInfo, { where: { id: templateId } }));
    if (err) TE(err.message);
    return template;
}
module.exports.updateEmailTemplate = updateEmailTemplate;

//Get all email templates

module.exports.getAllEmailTemplates = async function () {

    [err, templates] = await to(TOA_email_template.findAll());
    if (err) TE(err.message);
    return templates;
}