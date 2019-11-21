const { TOA_currency, TOA_account, TOA_city, TOA_country, TOA_subject, TOA_tutor, TOA_review, TOA_student_purchase, TOA_branch, TOA_paymentgateway, TOA_privacypolicy, TOA_content, TOA_ppt, TOA_pdf, TOA_audio, TOA_video, TOA_test, TOA_test_question, TOA_practice, TOA_practice_question, TOA_test_result } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports.getRequestedAccountById = async function (accountId) {

    [err, account] = await to(TOA_account.findOne({
        where: { account_id: accountId, status: 0, delete: 0 },
        attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
    }));
    if (err) TE(err.message);
    return account;
}

module.exports.getRequestedAccount = async function (domainName) {

    [err, account] = await to(TOA_account.findOne({
        where: { account_domain: domainName, status: 0, delete: 0 },
        attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email'], ['pin_code', 'pinCode']],
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
    if (err) TE(err.message);
    return account;
}

// Returning Subject List of the account
module.exports.getCoursesList = async function (accountId) {

    [err, coursesList] = await to(TOA_subject.findAll({

        where: { subject_type: 1, status: 0, delete: 0 },
        attributes: [
            ['subject_id', 'id'], ['subject_title', 'title'], ['subject_image', 'image'], ['subject_description', 'description'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'status', 'paymentgateway_id',
            [Sequelize.fn("AVG", Sequelize.col("rating")), "reviewCount"],
        ],
        include: [
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key']],
            },
            {

                model: TOA_tutor,
                where: { account_id: accountId, status: 0, delete: 0 },
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], ['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_qualification', 'qualification'], ['tutor_experience', 'experience']],
            },
            {
                model: TOA_review,
                as: 'reviews',
                where: { type: 1 },
                attributes: [],
                required: false,

            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code']
            },
        ],
        group: ['subject_id'],
    }
    ));

    if (err) TE(err.message);
    return coursesList;
}



module.exports.checkPurchase = async function (type, typeId, studentId) {
    
    [err, purchaseList] = await to(TOA_student_purchase.findOne(
        {

            where: { type: type, typeId: typeId, student_id: studentId },
            attributes: ['id', 'dayLimit', ['createdAt', 'purchaseDate'], [Sequelize.fn('datediff', Sequelize.fn("NOW"), Sequelize.col('createdAt')), 'remainDays']],
            order: [['createdAt', 'DESC']]
        }
    ));
    if (err) TE(err.message);
    return purchaseList;
}


module.exports.getAccountDetailAndBranches = async function (accountId) {

    [err, account] = await to(TOA_account.findOne({

        where: { account_id: accountId, status: 0, delete: 0 },
        attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email'], ['pin_code', 'pinCode']],
        include: [
            {
                model: TOA_branch,
                as: 'branches',
                where: { status: 0, delete: 0 },
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
    if (err) TE(err.message);
    return account;
}

module.exports.getPrivacyPolicy = async function (accountId) {

    [err, privacyPolicy] = await to(TOA_privacypolicy.findOne({

            where: { account_id: accountId },
            attributes: [['privacypolicy_id', 'id'], ['privacypolicy_title', 'title'], ['privacypolicy_description', 'description']]
        }
    ));
    if (err) TE(err.message);
    return privacyPolicy;
}