const { TOA_currency, TOA_coupon , TOA_testbundle_Bundle, TOA_ios_paymentgateway, TOA_student_purchase, TOA_paymentgateway, TOA_student_purchase_detail, TOA_subject, TOA_topic, TOA_content, TOA_pdf, TOA_ppt, TOA_audio, TOA_video, TOA_test, TOA_tutor, TOA_branch, TOA_account } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');

module.exports.getCoupon = async function (accountId, subjectId, couponCode) {

    [err, coupon] = await to(TOA_coupon.findOne({
        where: { account_id: accountId, subject_id: subjectId, coupon_code: couponCode, status: 0, delete: 0 },
        attributes: [['coupon_id', 'id'], ['coupon_title', 'title'], ['coupon_code', 'code'], ['coupon_user' , 'maxUsers'] ,['coupon_discount', 'discount'], ['coupon_min_buy_amount', 'minBuyAmount'], ['coupon_max_amount', 'maxAmount'], ['coupon_sdate', 'startDate'], ['coupon_edate', 'endDate']],
        include:[
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            }
        ]
    }));
    if (err) TE(err.message);
    return coupon;
}

module.exports.getCouponUsedUserCount = async function (couponId) {

    [err, totalUsers] = await to(TOA_student_purchase.count({
        include: [
            {
                model: TOA_student_purchase_detail,
                as: 'payments',
                where : {offer_id : couponId},
            }
        ]
    }));
    if (err) TE(err.message);
    return totalUsers;
}

module.exports.addPurchase = async function (purchaseJson) {

    [err, purchase] = await to(TOA_student_purchase.create(purchaseJson));
    if (err) TE(err.message);
    return purchase;
}

module.exports.addPurchaseDetail = async function (purchaseDetailJson) {

    [err, purchaseDetail] = await to(TOA_student_purchase_detail.create(purchaseDetailJson));
    if (err) TE(err.message);
    return purchaseDetail;
}

module.exports.purchaseList = async function (studentId) {

    [err, purchaseList] = await to(TOA_student_purchase.findAll({

        where: { student_id: studentId },
        group: ['payments.id'],
        attributes: [
            'id', 'student_id', 'type', 'typeId', 'dayLimit', ['createdAt', 'purchasedAt']
        ],
        include: [
            {

                model: TOA_student_purchase_detail,
                as: 'payments',
                attributes: ['id', ['transaction_id', 'transactionId'], ['payment_response', 'response'], 'amount'],
                include: [
                    {
                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['title', 'sign', 'code']
                    }
                ]
            }
        ]
    }))
    if (err) TE(err.message);
    return purchaseList;

}

module.exports.getPurchase = async function (studentId, purchaseId) {

    [err, purchaseList] = await to(TOA_student_purchase.findOne({

        where: { student_id: studentId, id: purchaseId },
        group: ['payments.id'],
        attributes: [
            'id', 'student_id', 'type', 'typeId', 'dayLimit', ['createdAt', 'purchasedAt']
        ],
        include: [
            {

                model: TOA_student_purchase_detail,
                as: 'payments',
                attributes: ['id', ['transaction_id', 'transactionId'], ['payment_response', 'response'], 'amount'],
                include: [
                    {
                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
                    },
                ]
            }
        ]
    }))
    if (err) TE(err.message);
    return purchaseList;

}

// Get Single Subject
module.exports.getSubject = async function (subjectId) {

    [err, subject] = await to(TOA_subject.findOne({

        where: { subject_id: subjectId, delete: 0 },
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], 'validity', ['tutor_id', 'tutorId']],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            }
        ]
    }));
    if (err) TE(err.message);
    return subject;

}

// Get stripe key
module.exports.getStripeKey = async function (accountId) {

    [err, stripe] = await to(TOA_paymentgateway.findOne({

        where: { paymentgateway_title: 'Stripe', account_id:accountId, delete: 0, status:0 },
        attributes: [['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
    }));
    if (err) TE(err.message);
    return stripe;

}

// Get Single Topic
module.exports.getTopic = async function (topicId) {

    [err, topic] = await to(TOA_topic.findOne({

        where: { topic_id: topicId, delete: 0 },
        attributes: [['topic_id', 'id'], ['topic_title', 'title'], 'validity'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { delete: 0 },
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount'], ['tutor_id', 'tutorId']]
            }
        ]
    }));
    if (err) TE(err.message);
    return topic;

}

// Get Single Content
module.exports.getContent = async function (contentId) {

    [err, content] = await to(TOA_content.findOne({

        where: { content_id: contentId, delete: 0 },
        attributes: [['content_id', 'id'], ['content_title', 'title'], 'validity'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { delete: 0 },
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount'], ['tutor_id', 'tutorId']]
            }
        ]
    }));
    if (err) TE(err.message);
    return content;

}

// Get Single PDF
module.exports.getPDF = async function (pdfId) {

    [err, pdf] = await to(TOA_pdf.findOne({

        where: { pdf_id: pdfId, delete: 0 },
        attributes: [['pdf_id', 'id'], ['pdf_title', 'title'], 'validity'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { delete: 0 },
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount'], ['tutor_id', 'tutorId']]
            }
        ]
    }));
    if (err) TE(err.message);
    return pdf;

}

// Get Single PPT
module.exports.getPPT = async function (pptId) {

    [err, ppt] = await to(TOA_ppt.findOne({

        where: { ppt_id: pptId, delete: 0 },
        attributes: [['ppt_id', 'id'], ['ppt_title', 'title'], 'validity'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { delete: 0 },
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount'], ['tutor_id', 'tutorId']]
            }
        ]
    }));
    if (err) TE(err.message);
    return ppt;

}

// Get Single Audio
module.exports.getAudio = async function (audioId) {

    [err, audio] = await to(TOA_audio.findOne({

        where: { audio_id: audioId, delete: 0 },
        attributes: [['audio_id', 'id'], ['audio_title', 'title'], 'validity'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { delete: 0 },
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount'], ['tutor_id', 'tutorId']]
            }
        ]
    }));
    if (err) TE(err.message);
    return audio;

}


// Get Single Video
module.exports.getVideo = async function (videoId) {

    [err, video] = await to(TOA_video.findOne({

        where: { video_id: videoId, delete: 0 },
        attributes: [['video_id', 'id'], ['video_title', 'title'], 'validity'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { delete: 0 },
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount'], ['tutor_id', 'tutorId']]
            }
        ]
    }));
    if (err) TE(err.message);
    return video;

}

// Get Test Bundle
module.exports.getTestBundle = async function (bundleId) {


    [err, bundle] = await to(TOA_testbundle_Bundle.findOne({
        where: { delete: 0, id: bundleId },
        attributes: ['id', 'title', 'isPublished', 'isPaid', 'paymentGateWayId', 'amount', 'validity', 'preview', 'status'],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            }

        ]
    }));
    if (err) TE(err.message);
    return bundle;

}

// Get Single Test
module.exports.getTest = async function (testId) {

    [err, test] = await to(TOA_test.findOne({

        where: { test_id: testId, delete: 0 },
        attributes: [['test_id', 'id'], ['test_title', 'title']]
    }));
    if (err) TE(err.message);
    return test;

}


// module.exports.getAboutUs = async function (studentId) {

//     [err, aboutUs] = await to(TOA_student.findOne({

//         where: { id: studentId },
//         include: [
//             {
//                 model: TOA_branch,
//                 as: 'branch',
//                 include: [
//                     {
//                         model: TOA_account,
//                         as: 'account',
//                         include: [

//                             {
//                                 model: TOA_about,
//                                 as: 'aboutUs',
//                                 attributes: [['about_title', 'title'],['about_description', 'description']],
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }));
//     if (err) TE(err.message);
//     return aboutUs;
// }



// module.exports.getPrivacyPolices = async function (studentId) {

//     [err, aboutUs] = await to(TOA_student.findOne({

//         where: { id: studentId },
//         include: [
//             {
//                 model: TOA_branch,
//                 as: 'branch',
//                 include: [
//                     {
//                         model: TOA_account,
//                         as: 'account',
//                         include: [

//                             {
//                                 model: TOA_privacypolicy,
//                                 as: 'privacyPolicy',
//                                 attributes: [['privacypolicy_title', 'title'],['privacypolicy_description', 'description']],
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }));
//     if (err) TE(err.message);
//     return aboutUs;
// }