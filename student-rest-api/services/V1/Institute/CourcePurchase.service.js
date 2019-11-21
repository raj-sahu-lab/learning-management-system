const { TOA_testbundle_Bundle , TOA_student_purchase, TOA_student_purchase_detail, TOA_subject, TOA_topic, TOA_content, TOA_test, TOA_student_institute_relationship, TOA_branch, TOA_student, TOA_paymentgateway, TOA_ios_paymentgateway, TOA_currency, TOA_video, TOA_audio, TOA_ppt, TOA_pdf } = require('../../../models');
const { to, TE } = require('../util.service');

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

module.exports.getStudent = async function (studentId) {

    [err, student] = await to(TOA_student.findOne({

        where: { status: 0, delete: 0, id: studentId },
        attributes: ['id', 'first_name', 'last_name', 'image', 'email'],
    }));
    if (err) TE(err.message);
    return student;
}

module.exports.getPurchaseList = async function (accountId) {

    [err, studentList] = await to(TOA_student_purchase.findAll({
        order: [['id', 'DESC']],
        where: { account_id: accountId },
        attributes: ['id', 'type', 'typeId', 'student_id'],
        include: [
            {

                model: TOA_student_purchase_detail,
                as: 'payments',
                attributes: ['id', 'payment_response', 'amount', ['createdAt', 'paidDate']],
                include: [
                    {
                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_id' , 'id'] ,['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key']],
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
            },
            {
                model: TOA_student,
                as: 'student',
                attributes: ['id', 'first_name', 'last_name', 'email', 'countryCode', 'phone'],

            }
        ]
    }));
    if (err) TE(err.message);
    return studentList;
}


// Get All Subject List
module.exports.getSubject = async function (accountId, subjectId) {

    [err, subject] = await to(TOA_subject.findOne({
        where: { account_id: accountId, status: 0, delete: 0, subject_type: 1, subject_id: subjectId },
        order: [['updatedAt', 'DESC']],
        attributes: [['subject_id', 'id'], ['subject_title', 'title']],

    }));
    if (err) TE(err.message);
    return subject;

};

// Get All Subject List
module.exports.getSubjectList = async function (accountId, branchId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, subject_type: 1 };

    if (branchId) {

        whereCondition.branch_id = branchId;
    }

    [err, subjectList] = await to(TOA_subject.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],

    }));
    if (err) TE(err.message);
    return subjectList;

};


// Get All Topic List
module.exports.getTopicList = async function (accountId , branchId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, topic_type: 1 };

    if (branchId) {

        whereCondition.branch_id = branchId;
    }

    [err, topicList] = await to(TOA_topic.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],

    }));
    if (err) TE(err.message);
    return topicList;

};


// Get All Content List
module.exports.getContentList = async function (accountId , branchId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, content_type: 1 };

    if (branchId) {

        whereCondition.branch_id = branchId;
    }

    [err, contentList] = await to(TOA_content.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],

    }));
    if (err) TE(err.message);
    return contentList;

};

// Get All Test List
module.exports.getTestList = async function (accountId , branchId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, test_type: 1 };

    if (branchId) {

        whereCondition.branch_id = branchId;
    }

    [err, testList] = await to(TOA_test.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],

    }));
    if (err) TE(err.message);
    return testList;

};


// Get All Test Bundle List
module.exports.getTestBundleList = async function (accountId) {

    var whereCondition = { accountId: accountId, status: 0, delete: 0, isPaid: 1 };

    [err, testBundleList] = await to(TOA_testbundle_Bundle.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: ['id' , 'title' , 'amount', 'currencyId', 'paymentGateWayId'],

    }));
    if (err) TE(err.message);
    return testBundleList;

};


// Get All Pdf List
module.exports.getPdfList = async function (accountId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, pdf_type: 1 };

    [err, pdfList] = await to(TOA_pdf.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['pdf_id', 'id'], ['pdf_title', 'title'], ['pdf_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],
    }));
    if (err) TE(err.message);
    return pdfList;

};


// Get All Ppt List
module.exports.getPptList = async function (accountId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, ppt_type: 1 };

    [err, pptList] = await to(TOA_ppt.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['ppt_id', 'id'], ['ppt_title', 'title'], ['ppt_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],
    }));
    if (err) TE(err.message);
    return pptList;

};


// Get All Audio List
module.exports.getAudioList = async function (accountId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, audio_type: 1 };

    [err, audioList] = await to(TOA_audio.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['audio_id', 'id'], ['audio_title', 'title'], ['audio_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],
    }));
    if (err) TE(err.message);
    return audioList;

};


// Get All Video List
module.exports.getVideoList = async function (accountId) {

    var whereCondition = { account_id: accountId, status: 0, delete: 0, video_type: 1 };

    [err, videoList] = await to(TOA_video.findAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
        attributes: [['video_id', 'id'], ['video_title', 'title'], ['video_amount', 'amount'], 'currencyId', ['paymentgateway_id', 'paymentGateWayId']],
    }));
    if (err) TE(err.message);
    return videoList;

};