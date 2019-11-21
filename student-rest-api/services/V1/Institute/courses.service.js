const { TOA_subject, TOA_currency, TOA_paymentgateway, TOA_ios_paymentgateway, TOA_topic, TOA_branch, TOA_tutor, TOA_content, TOA_pdf, TOA_ppt, TOA_audio, TOA_video } = require('../../../models');
const { to, TE } = require('../util.service');




// ---------------------------------------------- Subject And Topic ---------------------------------------------- 

module.exports.getSubjectTopic = async function (user) {

    var conditionParam = { account_id: user.account_id, status: 0, delete: 0 };
    if (user.userType == 3) {
        conditionParam.tutor_id = user.id;
    }
    [err, subject] = await to(TOA_subject.findAll({

        where: conditionParam,
        order: [['subject_id', 'DESC']],
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_type', 'isPaid']],
        include: [
            {

                model: TOA_topic,
                as: 'topics',
                where: { account_id: user.account_id, status: 0, delete: 0 },
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
                required: false,
                include: [{

                    model: TOA_content,
                    as: 'contents',
                    where: { account_id: user.account_id, status: 0, delete: 0 },
                    attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
                    required: false,

                }]
            },
            {
                model: TOA_tutor,
                as: 'tutor',
                where: { status: 0, delete: 0 },
                attributes: [['tutor_id', 'id']],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        where: { status: 0, delete: 0 },
                        attributes: []
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return subject;

}


module.exports.getCurrencyList = async function () {
    [err, currencyList] = await to(TOA_currency.findAll(
        {
            where: {status : 0 ,delete : 0},
            attributes: ['id', 'title', 'sign', 'code'],
        }
    ));
    if (err) TE(err.message);
    return currencyList;
}
// ---------------------------------------------- Subject ---------------------------------------------- 

// Add New Subject
module.exports.addSubject = async function (subject) {

    [err, subject] = await to(TOA_subject.create(subject));
    if (err) TE(err.message);
    return subject;
}

// Update Subject
module.exports.updateSubject = async function (subjectId, subjectJson) {

    [err, subject] = await to(TOA_subject.update(subjectJson, { where: { subject_id: subjectId } }));
    if (err) TE(err.message);
    return subject;
}

// Get All Subject List
module.exports.getSubjectList = async function (accountId) {

    [err, subjectList] = await to(TOA_subject.findAll({
        where: { account_id: accountId, delete: 0 },
        order: [['subject_id', 'DESC']],
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'status', 'paymentgateway_id'],
        include: [
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {

                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_tutor,
                as: 'tutor',
                where: { status: 0, delete: 0 },
                attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        where: { status: 0, delete: 0 },
                        attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                    }
                ]
            }]
    }));
    if (err) TE(err.message);
    return subjectList;

}

// Get Single Subject
module.exports.getSubject = async function (accountId, subjectId) {

    [err, subject] = await to(TOA_subject.findOne({

        where: { account_id: accountId, subject_id: subjectId, delete: 0 },
        order: [['subject_id', 'DESC']],
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'status', 'paymentgateway_id'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {

                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_tutor,
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                    }
                ]
            }]
    }));
    if (err) TE(err.message);
    return subject;

}

// Get Single Subject Of Tutor
module.exports.getTutorSubject = async function (accountId, tutorId) {

    [err, subject] = await to(TOA_subject.findOne({
        where: { account_id: accountId, tutor_id: tutorId, delete: 0 },
        order: [['subject_id', 'DESC']],
        attributes: [['subject_id', 'id'], ['tutor_id', 'tutorId'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'type'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'status', 'paymentgateway_id'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
        ]
    }));
    if (err) TE(err.message);
    return subject;

}

// Delete Subject
module.exports.deleteSubject = async function (accountId, subjectId) {

    const subjectJson = { delete: 1 };
    [err, subject] = await to(TOA_subject.update(subjectJson, { where: { account_id: accountId, subject_id: subjectId } }));
    if (err) TE(err.message);

    // [err, deleted] = await to(TOA_subject.destroy(
    //     {
    //         where: { account_id: accountId, subject_id: subjectId }
    //     }
    // ));
    if (err) TE(err.message);
    return subject;

}

// ---------------------------------------------- Subject ---------------------------------------------- 



// ---------------------------------------------- Topic ---------------------------------------------- 

// Add New Topic
const addTopic = async function (topic) {

    [err, topic] = await to(TOA_topic.create(topic));
    if (err) TE(err.message);
    return topic;
}
module.exports.addTopic = addTopic;

// Update Subject
const updateTopic = async function (topicId, topic) {

    [err, topic] = await to(TOA_topic.update(topic, { where: { topic_id: topicId } }));
    if (err) TE(err.message);
    return topic;
}
module.exports.updateTopic = updateTopic;

// Get All Subject List
module.exports.getTopicList = async function (user, subjectId) {

    var whereJson = { account_id: user.account_id, delete: 0 };
    if (subjectId) {

        whereJson.subject_id = subjectId
    }

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, topicList] = await to(TOA_topic.findAll({
        where: whereJson,
        order: [['topic_id', 'DESC']],
        attributes: [['topic_id', 'id'], ['subject_id', 'subjectId'], ['topic_title', 'title'], ['topic_description', 'description'], ['topic_type', 'isPaid'], 'validity', ['topic_amount', 'amount'], ['topic_preview', 'preview'], 'status', 'paymentgateway_id'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {

                model: TOA_subject,
                where: { account_id: user.account_id, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        where: whereTutorJson,
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return topicList;
}

// Get Single Subject
const getTopic = async function (accountId, topicId) {

    [err, topic] = await to(TOA_topic.findOne({
        where: { account_id: accountId, topic_id: topicId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['topic_id', 'id'], ['subject_id', 'subjectId'], ['topic_title', 'title'], ['topic_description', 'description'], ['topic_type', 'isPaid'], 'validity', ['topic_amount', 'amount'], ['topic_preview', 'preview'], 'status', 'paymentgateway_id'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return topic;

}
module.exports.getTopic = getTopic;

// Delete Subject
const deleteTopic = async function (accountId, topicId) {

    const topicJson = { delete: 1 };
    [err, topic] = await to(TOA_topic.update(topicJson, { where: { account_id: accountId, topic_id: topicId } }));
    if (err) TE(err.message);
    return topic;

}
module.exports.deleteTopic = deleteTopic;

// ---------------------------------------------- Topic ---------------------------------------------- 


// ---------------------------------------------- Content ---------------------------------------------- 

// Add New Content
module.exports.addContent = async function (content) {

    [err, content] = await to(TOA_content.create(content));
    if (err) TE(err.message);
    return content;
}


// Update Content
module.exports.updateContent = async function (content, contentId) {

    [err, content] = await to(TOA_content.update(content, { where: { content_id: contentId } }));
    if (err) TE(err.message);
    return content;
}


module.exports.getContent = async function (accountId, contentId) {

    [err, content] = await to(TOA_content.findOne({
        where: { account_id: accountId, content_id: contentId, delete: 0 },
        attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_description', 'description'], ['content_type', 'isPaid'], 'validity', ['content_amount', 'amount'], ['content_preview', 'preview'], ['content_test', 'isTest'], ['content_practice', 'isPractice'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { account_id: accountId, delete: 0 },
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                as: 'topic',
                where: { account_id: accountId, delete: 0 },
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid'], ['topic_amount', 'amount']],

            }
        ]
    }));
    if (err) TE(err.message);
    return content;
}


module.exports.getContentList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, contentList] = await to(TOA_content.findAll({

        where: { account_id: user.account_id, delete: 0 },
        order: [['content_id', 'DESC']],
        attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_description', 'description'], ['content_type', 'isPaid'], 'validity', ['content_amount', 'amount'], ['content_preview', 'preview'], ['content_test', 'isTest'], ['content_practice', 'isPractice'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                as: 'subject',
                where: { account_id: user.account_id, delete: 0 },
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid'], ['subject_amount', 'amount']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        where: whereTutorJson,
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                as: 'topic',
                where: { account_id: user.account_id, delete: 0 },
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid'], ['topic_amount', 'amount']],

            }
        ]

    }));
    if (err) TE(err.message);
    return contentList;
}

// Delete Content
const deleteContent = async function (accountId, contentId) {

    const contentJson = { delete: 1 };
    [err, content] = await to(TOA_content.update(contentJson, { where: { account_id: accountId, content_id: contentId } }));
    if (err) TE(err.message);
    return content;

}
module.exports.deleteContent = deleteContent;
// ---------------------------------------------- Content ---------------------------------------------- 


// ---------------------------------------------- PDF ---------------------------------------------- 

// Add New PDF
const addPDF = async function (pdf) {

    [err, pdf] = await to(TOA_pdf.create(pdf));
    if (err) TE(err.message);
    return pdf;
}
module.exports.addPDF = addPDF;

// Update PDF
const updatePDF = async function (pdfId, pdfJson) {

    [err, pdf] = await to(TOA_pdf.update(pdfJson, { where: { pdf_id: pdfId } }));
    if (err) TE(err.message);
    return pdf;
}
module.exports.updatePDF = updatePDF;

// Get Single PDF File
const getPDF = async function (accountId, pdfId) {

    [err, pdf] = await to(TOA_pdf.findOne({

        where: { account_id: accountId, pdf_id: pdfId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['pdf_id', 'id'], ['pdf_title', 'title'], ['pdf_url', 'url'], ['pdf_type', 'isPaid'], 'paymentgateway_id', 'validity', ['pdf_amount', 'amount'], ['pdf_preview', 'preview'], 'downloadable', 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: accountId, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return pdf;
}
module.exports.getPDF = getPDF;

// Get All PDF File List
const getPDFList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, pdfList] = await to(TOA_pdf.findAll({

        where: { account_id: user.account_id, delete: 0 },
        order: [['pdf_id', 'DESC']],
        attributes: [['pdf_id', 'id'], ['pdf_title', 'title'], ['pdf_url', 'url'], ['pdf_type', 'isPaid'], 'paymentgateway_id', 'validity', ['pdf_amount', 'amount'], ['pdf_preview', 'preview'], 'downloadable', 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: user.account_id, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        where: whereTutorJson,
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: user.account_id, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: user.account_id, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return pdfList;
}
module.exports.getPDFList = getPDFList;

// Delete Content
const deletePDF = async function (accountId, pdfId) {

    const pdfJson = { delete: 1 };
    [err, pdf] = await to(TOA_pdf.update(pdfJson, { where: { account_id: accountId, pdf_id: pdfId } }));
    if (err) TE(err.message);
    return pdf;
}
module.exports.deletePDF = deletePDF;

// ---------------------------------------------- PDF ---------------------------------------------- 


// ---------------------------------------------- PPT ---------------------------------------------- 

// Add New PPT
const addPPT = async function (ppt) {

    [err, ppt] = await to(TOA_ppt.create(ppt));
    if (err) TE(err.message);
    return ppt;
}
module.exports.addPPT = addPPT;

// Update PPT
const updatePPT = async function (pptId, pptJson) {

    [err, ppt] = await to(TOA_ppt.update(pptJson, { where: { ppt_id: pptId } }));
    if (err) TE(err.message);
    return ppt;
}
module.exports.updatePPT = updatePPT;

// Get Single PPT File
const getPPT = async function (accountId, pptId) {

    [err, ppt] = await to(TOA_ppt.findOne({

        where: { account_id: accountId, ppt_id: pptId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['ppt_id', 'id'], ['ppt_title', 'title'], ['ppt_url', 'url'], ['ppt_type', 'isPaid'], 'paymentgateway_id', 'validity', ['ppt_amount', 'amount'], ['ppt_preview', 'preview'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: accountId, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return ppt;
}
module.exports.getPPT = getPPT;

// Get All PPT File List
const getPPTList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, pptList] = await to(TOA_ppt.findAll({

        where: { account_id: user.account_id, delete: 0 },
        order: [['ppt_id', 'DESC']],
        attributes: [['ppt_id', 'id'], ['ppt_title', 'title'], ['ppt_url', 'url'], ['ppt_type', 'isPaid'], 'paymentgateway_id', 'validity', ['ppt_amount', 'amount'], ['ppt_preview', 'preview'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: user.account_id, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        where: whereTutorJson,
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: user.account_id, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: user.account_id, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return pptList;
}
module.exports.getPPTList = getPPTList;

// Delete Content
const deletePPT = async function (accountId, pptId) {

    const pptJson = { delete: 1 };
    [err, ppt] = await to(TOA_ppt.update(pptJson, { where: { account_id: accountId, ppt_id: pptId } }));
    if (err) TE(err.message);
    return ppt;
}
module.exports.deletePPT = deletePPT;

// ---------------------------------------------- PPT ---------------------------------------------- 



// ---------------------------------------------- Audio ---------------------------------------------- 

// Add New Audio
const addAudio = async function (audio) {

    [err, audio] = await to(TOA_audio.create(audio));
    if (err) TE(err.message);
    return audio;
}
module.exports.addAudio = addAudio;

// Update Audio
const updateAudio = async function (audioId, audioJson) {

    [err, audio] = await to(TOA_audio.update(audioJson, { where: { audio_id: audioId } }));
    if (err) TE(err.message);
    return audio;
}
module.exports.updateAudio = updateAudio;

// Get Single Audio File
const getAudio = async function (accountId, audioId) {

    [err, audio] = await to(TOA_audio.findOne({

        where: { account_id: accountId, audio_id: audioId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['audio_id', 'id'], ['audio_title', 'title'], ['audio_url', 'url'], ['audio_type', 'isPaid'], 'paymentgateway_id', 'validity', ['audio_duration', 'duration'], ['audio_amount', 'amount'], ['audio_preview', 'preview'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: accountId, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return audio;
}
module.exports.getAudio = getAudio;

// Get All Audio File List
const getAudioList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, audioList] = await to(TOA_audio.findAll({

        where: { account_id: user.account_id, delete: 0 },
        order: [['audio_id', 'DESC']],
        attributes: [['audio_id', 'id'], ['audio_title', 'title'], ['audio_url', 'url'], ['audio_type', 'isPaid'], 'paymentgateway_id', 'validity', ['audio_duration', 'duration'], ['audio_amount', 'amount'], ['audio_preview', 'preview'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: user.account_id, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        where: whereTutorJson,
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: user.account_id, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: user.account_id, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return audioList;
}
module.exports.getAudioList = getAudioList;

// Delete Content
const deleteAudio = async function (accountId, audioId) {

    const audioJson = { delete: 1 };
    [err, audio] = await to(TOA_audio.update(audioJson, { where: { account_id: accountId, audio_id: audioId } }));
    if (err) TE(err.message);
    return audio;
}
module.exports.deleteAudio = deleteAudio;

// ---------------------------------------------- Audio ---------------------------------------------- 


// ---------------------------------------------- Video ---------------------------------------------- 

// Add New Video
const addVideo = async function (video) {

    [err, video] = await to(TOA_video.create(video));
    if (err) TE(err.message);
    return video;
}
module.exports.addVideo = addVideo;

// Update Video
const updateVideo = async function (videoId, videoJson) {

    [err, video] = await to(TOA_video.update(videoJson, { where: { video_id: videoId } }));
    if (err) TE(err.message);
    return video;
}
module.exports.updateVideo = updateVideo;

// Get Single Video File
const getVideo = async function (accountId, videoId) {

    [err, video] = await to(TOA_video.findOne({

        where: { account_id: accountId, video_id: videoId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['video_id', 'id'], ['video_title', 'title'], ['video_url', 'url'], ['video_stream_type', 'type'], 'paymentgateway_id', 'validity', ['video_duration', 'duration'], ['video_type', 'isPaid'], ['video_amount', 'amount'], ['video_preview', 'preview'], ['videoProcessingStatus', 'processingStatus'], ['videoHLSURL', 'hlsURL'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: accountId, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return video;
}
module.exports.getVideo = getVideo;


// Get Single Video File
module.exports.getVideoByTransmisionId = async function (transmisionId) {

    [err, video] = await to(TOA_video.findOne({

        where: { videoTransmissionId: transmisionId, delete: 0 },
        attributes: [['video_id', 'id'], ['video_title', 'title'], ['video_url', 'url'], ['video_stream_type', 'type'], 'paymentgateway_id', 'validity', ['video_type', 'isPaid'], ['video_amount', 'amount'], ['video_preview', 'preview'], ['videoProcessingStatus', 'processingStatus'], ['videoHLSURL', 'hlsURL'], 'status']
    }));
    if (err) TE(err.message);
    return video;
}

// Get All Video File List
const getVideoList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }
    [err, videoList] = await to(TOA_video.findAll({

        where: { account_id: user.account_id, delete: 0 },
        order: [['video_id', 'DESC']],
        attributes: [['video_id', 'id'], ['video_title', 'title'], ['video_url', 'url'], ['video_stream_type', 'type'], 'paymentgateway_id', 'validity', ['video_duration', 'duration'], ['video_type', 'isPaid'], ['video_amount', 'amount'], ['video_preview', 'preview'], ['videoProcessingStatus', 'processingStatus'], ['videoHLSURL', 'hlsURL'], 'status'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id', 'id'], ['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                where: { account_id: user.account_id, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_type', 'isPaid']],
                include: [
                    {
                        model: TOA_tutor,
                        as: 'tutor',
                        where: whereTutorJson,
                        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
                        include: [
                            {
                                model: TOA_branch,
                                as: 'branch',
                                attributes: [['branch_id', 'id'], ['branch_name', 'name']]
                            }
                        ]
                    }
                ]
            },
            {
                model: TOA_topic,
                where: { account_id: user.account_id, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_type', 'isPaid']],
            },
            {
                model: TOA_content,
                where: { account_id: user.account_id, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_type', 'isPaid']],
            }
        ]
    }));
    if (err) TE(err.message);
    return videoList;
}
module.exports.getVideoList = getVideoList;

// Delete Content
const deleteVideo = async function (accountId, videoId) {

    const videoJson = { delete: 1 };
    [err, video] = await to(TOA_video.update(videoJson, { where: { account_id: accountId, video_id: videoId } }));
    if (err) TE(err.message);
    return video;
}
module.exports.deleteVideo = deleteVideo;


// ---------------------------------------------- Video ---------------------------------------------- 