const { TOA_student, TOA_currency , TOA_ios_paymentgateway, TOA_subject, TOA_tutor, TOA_review, TOA_student_purchase, TOA_branch, TOA_paymentgateway, TOA_topic, TOA_content, TOA_ppt, TOA_pdf, TOA_audio, TOA_video, TOA_test, TOA_test_question, TOA_practice, TOA_practice_question, TOA_test_result, TOA_video_log, TOA_audio_log, TOA_pdf_log } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports.getDefaultBranch = async function (studentId) {

    [err, student] = await to(TOA_student.findOne({

        where: { id: studentId, status: 0, delete: 0 }

    }));

    if (err) TE(err.message);
    return student;
}

// Returning Subject List
module.exports.getCoursesList = async function (branchId, studentId) {

    [err, coursesList] = await to(TOA_subject.findAll({

        where: { status: 0, delete: 0 },
        attributes: [
            ['subject_id', 'id'], ['subject_title', 'title'], ['subject_image', 'image'], ['subject_description', 'description'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'status', 'paymentgateway_id',
            [Sequelize.fn("AVG", Sequelize.col("rating")), "reviewCount"],
        ],

        include: [
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {

                model: TOA_tutor,
                where: { status: 0, delete: 0 },
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], ['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_qualification', 'qualification'], ['tutor_experience', 'experience']],
                include: [{

                    model: TOA_branch,
                    where: { status: 0, delete: 0, branch_id: branchId },
                    as: 'branch',
                    attributes: []
                }]
            },
            {
                model: TOA_review,
                as: 'reviews',
                where: { type: 1 },
                attributes: [],
                required: false,

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

// Getting Tutor List
module.exports.getTutorList = async function (branchId) {

    [err, tutorList] = await to(TOA_tutor.count({ where: { branch_id: branchId, delete: 0 } }));
    if (err) TE(err.message);
    return tutorList;

}

module.exports.getPurchaseCount = async function (studentId) {

    [err, purchaseCount] = await to(TOA_student_purchase.count({ where: { student_id: studentId } }));
    if (err) TE(err.message);
    return purchaseCount;

}

// Getting Topics for selected Subject
module.exports.getTopicForSubject = async function (subjectId, studentId) {


    [err, subjectAndTopic] = await to(TOA_subject.findOne({

        where: { status: 0, delete: 0, subject_id: subjectId },
        attributes: [
            ['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'paymentgateway_id',
            [Sequelize.fn("AVG", Sequelize.col("rating")), "reviewCount"],
        ],
        group: ['topics.topic_id'],
        include: [
            {
                model: TOA_review,
                as: 'reviews',
                where: { type: 1 },
                attributes: [],
                required: false,

            },
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {

                model: TOA_tutor,
                where: { status: 0, delete: 0 },
                as: 'tutor',
                attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], ['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_qualification', 'qualification'], ['tutor_experience', 'experience']]
            },
            {
                model: TOA_topic,
                as: 'topics',
                where: { status: 0, delete: 0 },
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_description', 'description'], ['topic_type', 'isPaid'], 'validity', ['topic_amount', 'amount'], ['topic_preview', 'preview'], 'paymentgateway_id'],
                required: false,
                include: [
                    {

                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['id', 'title', 'sign', 'code'],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
                    },
                    // {
                    //     model: TOA_student_purchase,
                    //     as: 'payments',
                    //     where: { type: 2,student_id: studentId },
                    //     required: false

                    // }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    [err, student] = await to(TOA_student_purchase.findAll({
        where: { type: 1, typeId: subjectAndTopic.toJSON().id},
        group: ['student_id'],
        attributes: [['typeId','subjectId']],
        include:[{
            model: TOA_student,
            as: 'student',
            attributes: ['image']
        }]

    }));
    
    let subJson = subjectAndTopic.toJSON();
    subJson.userList = student;
    return subJson;

}

// Getting Content for selected Topic
module.exports.getContentForTopic = async function (topicId, studentId) {


    [err, topicConetent] = await to(TOA_topic.findOne({

        where: { status: 0, delete: 0, topic_id: topicId },
        attributes: [['topic_id', 'id'], ['subject_id', 'subjectId'], ['topic_title', 'title'], ['topic_description', 'description'], ['topic_type', 'isPaid'], 'validity', ['topic_amount', 'amount'], ['topic_preview', 'preview'], 'paymentgateway_id'],
        group: ['contents.content_id'],
        include: [
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview']]
            },
            {
                model: TOA_content,
                as: 'contents',
                where: { status: 0, delete: 0 },
                required: false,
                attributes: [
                    ['content_id', 'id'], ['content_title', 'title'], ['content_description', 'description'], ['content_type', 'isPaid'], 'validity', ['content_amount', 'amount'], ['content_preview', 'preview'], 'paymentgateway_id'
                ],

                include: [
                    {
                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['id', 'title', 'sign', 'code'],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
                    },
                    {
                        model: TOA_pdf,
                        as: 'pdf',
                        where: { status: 0, delete: 0 },
                        attributes: [],
                        required: false,
                    },
                    {
                        model: TOA_ppt,
                        as: 'ppt',
                        where: { status: 0, delete: 0 },
                        attributes: [],
                        required: false,
                    },
                    {
                        model: TOA_audio,
                        as: 'audio',
                        where: { status: 0, delete: 0 },
                        attributes: [],
                        required: false,
                    },
                    {
                        model: TOA_video,
                        as: 'video',
                        where: { status: 0, delete: 0 },
                        attributes: [],
                        required: false,
                    },

                ]
            }
        ]
    }));
    if (err) TE(err.message);
    let contentJson = topicConetent.toJSON();
    await Promise.all(contentJson.contents.map(async (content) => {
        [err, content.pdfCount] = await to(TOA_pdf.count({
            where: { status: 0, delete: 0, content_id: content.id },
        }));
        [err, content.pptCount] = await to(TOA_ppt.count({
            where: { status: 0, delete: 0, content_id: content.id },
        }));
        [err, content.audioCount] = await to(TOA_audio.count({
            where: { status: 0, delete: 0, content_id: content.id },
        }));
        [err, content.videoCount] = await to(TOA_video.count({
            where: { status: 0, delete: 0, content_id: content.id },
        }));
    }));
    return contentJson;

}

// Getting PPT , PDF, Audio , Video for Content
module.exports.getContentFiles = async function (contentId, studentId) {


    [err, contentList] = await to(TOA_content.findOne({

        where: { status: 0, delete: 0, content_id: contentId },

        attributes: [['content_id', 'id'], ['content_title', 'title'], ['content_description', 'description'], ['content_type', 'isPaid'], 'validity', ['content_amount', 'amount'], ['content_preview', 'preview'], 'paymentgateway_id'],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview'], 'tutor_id'],
                required: false,
                include: [{

                    model: TOA_tutor,
                    as: 'tutor',
                    attributes: [['tutor_image', 'image'], ['tutor_name', 'name'], ['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_qualification', 'qualification'], ['tutor_experience', 'experience']],
                }]
            },
            {
                model: TOA_topic,
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title'], ['topic_description', 'description'], ['topic_type', 'isPaid'], 'validity', ['topic_amount', 'amount'], ['topic_preview', 'preview']],
                required: false,
            },
            {
                model: TOA_pdf,
                where: { status: 0, delete: 0 },
                as: 'pdf',
                required: false,
                raw: false,
                attributes: [['pdf_id', 'id'], ['pdf_title', 'title'], ['pdf_url', 'url'], ['pdf_type', 'isPaid'], 'paymentgateway_id', 'validity', ['pdf_amount', 'amount'], ['pdf_preview', 'preview'], 'downloadable' ,'status'],
                include: [
                    {

                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['id', 'title', 'sign', 'code'],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
                    },
                    {

                        model: TOA_pdf_log,
                        as: 'pdfProgress',
                        required: false,
                        attributes: [['seenDuration', 'secounds']],
                    }
                ]
            },
            {
                model: TOA_ppt,
                where: { status: 0, delete: 0 },
                as: 'ppt',
                required: false,
                attributes: [['ppt_id', 'id'], ['ppt_title', 'title'], ['ppt_url', 'url'], ['ppt_type', 'isPaid'], 'paymentgateway_id', 'validity', ['ppt_amount', 'amount'], ['ppt_preview', 'preview'], 'status'],
                include: [
                    {

                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['id', 'title', 'sign', 'code'],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
                    },
                ]
            },
            {
                model: TOA_audio,
                where: { status: 0, delete: 0 },
                as: 'audio',
                required: false,
                attributes: [['audio_id', 'id'], ['audio_title', 'title'], ['audio_url', 'url'], ['audio_type', 'isPaid'], 'paymentgateway_id', 'validity', ['audio_duration', 'duration'], ['audio_amount', 'amount'], ['audio_preview', 'preview'], 'status'],
                include: [
                    {

                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['id', 'title', 'sign', 'code'],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
                    },
                    {

                        model: TOA_audio_log,
                        as: 'audioProgress',
                        required: false,
                        attributes: [['seenDuration', 'secounds']],
                    }]
            },
            {
                model: TOA_video,
                where: { status: 0, delete: 0 },
                as: 'video',
                required: false,
                attributes: [['video_id', 'id'], ['video_title', 'title'], ['video_url', 'url'], ['video_stream_type', 'type'], ['video_type', 'isPaid'], 'paymentgateway_id', 'validity', ['video_duration', 'duration'], ['video_amount', 'amount'], ['video_preview', 'preview'], 'videoProcessingStatus', ['videoHLSURL', 'hlsURL'], 'status'],
                include: [
                    {

                        model: TOA_paymentgateway,
                        as: 'payment_type',
                        attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
                    },
                    {
                        model: TOA_currency,
                        as: 'currency',
                        attributes: ['id', 'title', 'sign', 'code'],
                    },
                    {
                        model: TOA_ios_paymentgateway,
                        as: 'iosPaymentGateWay',
                        attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
                    },
                    {

                        model: TOA_video_log,
                        as: 'videoProgress',
                        required: false,
                        attributes: [['seenDuration', 'secounds']],
                    }
                ]
            },
        ],
    }));

    if (err) TE(err.message);
    return contentList;
}

// Get Practice List
module.exports.getPracticeList = async function (contentId) {

    [err, practiceList] = await to(TOA_practice.findAll({

        where: { status: 0, delete: 0, content_id: contentId },
        attributes: [
            ['practice_id', 'id'], ['practice_title', 'title'], 'status',
            [Sequelize.fn('count', Sequelize.col('practice_question_id')), 'practiceQuestionCount']
        ],
        include: [
            {
                model: TOA_practice_question,
                as: 'question_list',
                where: { status: 0, delete: 0 },
                attributes: []
            }
        ],
        group: ['practice_id'],
    }));

    if (err) TE(err.message);
    return practiceList;
}

// Get Test list
module.exports.getTestsList = async function (contentId, studentId) {

    [err, testList] = await to(TOA_test.findAll({

        where: { status: 0, delete: 0, content_id: contentId },
        attributes: [

            ['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_type', 'isPaid'], 'paymentgateway_id', ['test_amount', 'amount'], ['test_preview', 'preview'], ['test_timed', 'timedTest'], ['test_duration', 'duration'], ['test_total_mark', 'totalMarks'], 'status',
            [Sequelize.fn('count', Sequelize.col('test_question_id')), 'questionCount']

        ],
        order: [['test_id', 'DESC']],
        include: [
            {
                model: TOA_student_purchase,
                as: 'payments',
                where: { type: 4, student_id: studentId },
                required: false

            },
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authsecret', 'secret']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {

                model: TOA_test_question,
                as: 'question_list',
                attributes: []

            },
            {
                model: TOA_test_result,
                as: 'testResult',
                required: false,
                where: { student_id: studentId },
                attributes: ['id', 'correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', ['createdAt', 'appeared']],
            }

        ],
        group: ['test_id'],
    }));

    if (err) TE(err.message);
    return testList;
}


module.exports.getReviewCoursesList = async function (branchId, studentId) {

    [err, coursesList] = await to(TOA_subject.findAll({

        where: { branch_id: branchId, status: 0, delete: 0 },
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description']],
        include: [
            {
                model: TOA_review,
                as: 'reviews',
                where: { type: 1 , student_id: studentId},
                // attributes: [],
                required: false,

            },
        ]
    }
    ));

    if (err) TE(err.message);
    return coursesList;
}