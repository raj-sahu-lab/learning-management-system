const { TOA_student, TOA_currency, TOA_ios_paymentgateway, TOA_subject, TOA_tutor, TOA_review, TOA_student_purchase, TOA_branch, TOA_paymentgateway, TOA_topic, TOA_content, TOA_ppt, TOA_pdf, TOA_audio, TOA_video, TOA_test, TOA_test_question, TOA_practice, TOA_practice_question, TOA_test_result, TOA_video_log, TOA_audio_log, TOA_pdf_log } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var moment = require('moment');

module.exports.getDefaultBranch = async function (studentId) {

    [err, student] = await to(TOA_student.findOne({

        where: { id: studentId, status: 0, delete: 0 }

    }));

    if (err) TE(err.message);
    return student;
}

// Returning Subject List
module.exports.getCoursesList = async function (branchId, studentId) {

    let today = moment().format();

    [err, subjectIds] = await to(TOA_student_purchase.findAll({ where: { type: 1, student_id: studentId } }));
    if (err) TE(err.message);

    var courseIds = [];

    await Promise.all(subjectIds.map(async (course) => {
        var courseJson = course.toJSON();
        var newDate = moment(courseJson.createdAt).add(courseJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            courseIds.push(courseJson.typeId);
        }
    }))

    var condition = { status: 0, [Op.or]: [{ delete: 0 }, { subject_id: { [Op.in]: courseIds } }] };

    [err, coursesList] = await to(TOA_subject.findAll({
        // where: { status: 0, delete: 0 },
        where: condition,
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
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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

    [err, tutorList] = await to(TOA_tutor.count({ where: { branch_id: branchId } }));
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

    let today = moment().format();

    [err, topicCount] = await to(TOA_student_purchase.findAll({ where: { type: 2, student_id: studentId } }));
    if (err) TE(err.message);

    var topicIds = [];

    await Promise.all(topicCount.map(async (course) => {
        var courseJson = course.toJSON();
        var newDate = moment(courseJson.createdAt).add(courseJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            topicIds.push(courseJson.typeId)
        }
    }))

    var condition = { status: 0, [Op.or]: [{ delete: 0 }, { topic_id: { [Op.in]: topicIds } }] };


    [err, subjectAndTopic] = await to(TOA_subject.findOne({

        where: { status: 0, subject_id: subjectId },
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
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
                // where: { status: 0, delete: 0 },
                where: condition,
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
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
        where: { type: 1, typeId: subjectAndTopic.toJSON().id },
        group: ['student_id'],
        order: [[Sequelize.col("id"), "DESC"]],
        attributes: ['id', ['typeId', 'subjectId']],
        include: [{
            model: TOA_student,
            as: 'student',
            attributes: ['image']
        }]

    }));

    let subJson = subjectAndTopic.toJSON();
    subJson.userList = student;
    return subJson;

}

module.exports.calculatePercentage = async function (id, type, userId) {
    if (type == 'subject') {

        [err, videos] = await to(TOA_video.findAll({

            where: { status: 0, delete: 0, subject_id: id },
            attributes: [
                ['subject_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("video_duration")), "videoDuration"], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "videoSeen"]
            ],
            group: ['subject_id'],
            include: [
                {
                    model: TOA_video_log,
                    as: 'videoProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        [err, audios] = await to(TOA_audio.findAll({

            where: { status: 0, delete: 0, subject_id: id },
            attributes: [
                ['subject_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("audio_duration")), "audioDuration"], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "audioSeen"]
            ],
            group: ['subject_id'],
            include: [
                {
                    model: TOA_audio_log,
                    as: 'audioProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        [err, pdfs] = await to(TOA_pdf.findAll({

            where: { status: 0, delete: 0, subject_id: id },
            attributes: [
                ['subject_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "pdfSeen"]
            ],
            group: ['subject_id'],
            include: [
                {
                    model: TOA_pdf_log,
                    as: 'pdfProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        let videoJson = videos.length ? videos[0].toJSON() : [];
        let audioJson = audios.length ? audios[0].toJSON() : [];
        let pdfJson = pdfs.length ? pdfs[0].toJSON() : [];

        return { 'percentage': Math.round(((videoJson.videoSeen && videoJson.videoDuration ? ((videoJson.videoSeen * 100) / videoJson.videoDuration) : 0) + (audioJson.audioSeen && audioJson.audioDuration ? ((audioJson.audioSeen * 100) / audioJson.audioDuration) : 0) + (pdfJson.pdfSeen ? pdfJson.pdfSeen : 0)) / 3) };

    } else if (type == 'topic') {
        [err, videos] = await to(TOA_video.findAll({

            where: { status: 0, delete: 0, topic_id: id },
            attributes: [
                ['topic_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("video_duration")), "videoDuration"], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "videoSeen"]
            ],
            group: ['topic_id'],
            include: [
                {
                    model: TOA_video_log,
                    as: 'videoProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        [err, audios] = await to(TOA_audio.findAll({

            where: { status: 0, delete: 0, topic_id: id },
            attributes: [
                ['topic_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("audio_duration")), "audioDuration"], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "audioSeen"]
            ],
            group: ['topic_id'],
            include: [
                {
                    model: TOA_audio_log,
                    as: 'audioProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        [err, pdfs] = await to(TOA_pdf.findAll({

            where: { status: 0, delete: 0, topic_id: id },
            attributes: [
                ['topic_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "pdfSeen"]
            ],
            group: ['topic_id'],
            include: [
                {
                    model: TOA_pdf_log,
                    as: 'pdfProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        let videoJson = videos.length ? videos[0].toJSON() : [];
        let audioJson = audios.length ? audios[0].toJSON() : [];
        let pdfJson = pdfs.length ? pdfs[0].toJSON() : [];
        return { 'percentage': Math.round(((videoJson.videoSeen && videoJson.videoDuration ? ((videoJson.videoSeen * 100) / videoJson.videoDuration) : 0) + (audioJson.audioSeen && audioJson.audioDuration ? ((audioJson.audioSeen * 100) / audioJson.audioDuration) : 0) + (pdfJson.pdfSeen ? pdfJson.pdfSeen : 0)) / 3) };
    } else if (type == 'content') {
        [err, videos] = await to(TOA_video.findAll({

            where: { status: 0, delete: 0, content_id: id },
            attributes: [
                ['content_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("video_duration")), "videoDuration"], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "videoSeen"]
            ],
            group: ['content_id'],
            include: [
                {
                    model: TOA_video_log,
                    as: 'videoProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        [err, audios] = await to(TOA_audio.findAll({

            where: { status: 0, delete: 0, content_id: id },
            attributes: [
                ['content_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("audio_duration")), "audioDuration"], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "audioSeen"]
            ],
            group: ['content_id'],
            include: [
                {
                    model: TOA_audio_log,
                    as: 'audioProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        [err, pdfs] = await to(TOA_pdf.findAll({

            where: { status: 0, delete: 0, content_id: id },
            attributes: [
                ['content_id', 'id'], [Sequelize.fn("AVG", Sequelize.col("seenDuration")), "pdfSeen"]
            ],
            group: ['content_id'],
            include: [
                {
                    model: TOA_pdf_log,
                    as: 'pdfProgress',
                    where: { studentId: userId },
                    attributes: [],
                    required: false,

                }
            ]
        }));

        let videoJson = videos.length ? videos[0].toJSON() : [];
        let audioJson = audios.length ? audios[0].toJSON() : [];
        let pdfJson = pdfs.length ? pdfs[0].toJSON() : [];
        return { 'percentage': Math.round(((videoJson.videoSeen && videoJson.videoDuration ? ((videoJson.videoSeen * 100) / videoJson.videoDuration) : 0) + (audioJson.audioSeen && audioJson.audioDuration ? ((audioJson.audioSeen * 100) / audioJson.audioDuration) : 0) + (pdfJson.pdfSeen ? pdfJson.pdfSeen : 0)) / 3) };
    } else {
        return { 'percentage': 0 };
    }

}

// get user list for course
module.exports.getCourseStudent = async function (subjectId) {

    [err, student] = await to(TOA_student_purchase.findAll({
        where: { type: 1, typeId: subjectId },
        group: ['student_id'],
        order: [[Sequelize.col("id"), "DESC"]],
        attributes: ['id', ['typeId', 'subjectId']],
        include: [{
            model: TOA_student,
            as: 'student',
            attributes: ['image']
        }]
    }));

    return student;

}


// Getting Content for selected Topic
module.exports.getContentForTopic = async function (topicId, studentId) {

    let today = moment().format();

    [err, contentCount] = await to(TOA_student_purchase.findAll({ where: { type: 3, student_id: studentId } }));
    if (err) TE(err.message);

    var contentIds = [];

    await Promise.all(contentCount.map(async (course) => {
        var courseJson = course.toJSON();
        var newDate = moment(courseJson.createdAt).add(courseJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            contentIds.push(courseJson.typeId)
        }
    }))

    var condition = { status: 0, [Op.or]: [{ delete: 0 }, { content_id: { [Op.in]: contentIds } }] };


    [err, topicConetent] = await to(TOA_topic.findOne({

        where: { status: 0, topic_id: topicId },
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
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title'], ['subject_description', 'description'], ['subject_image', 'image'], ['subject_type', 'isPaid'], 'validity', ['subject_amount', 'amount'], ['subject_preview', 'preview']]
            },
            {
                model: TOA_content,
                as: 'contents',
                // where: { status: 0, delete: 0 },
                where: condition,
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
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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

    let today = moment().format();

    //PDF purchase check
    [err, pdfCount] = await to(TOA_student_purchase.findAll({ where: { type: 6, student_id: studentId } }));
    if (err) TE(err.message);
    var pdfIds = [];
    await Promise.all(pdfCount.map(async (course) => {
        var pdfJson = course.toJSON();
        var newDate = moment(pdfJson.createdAt).add(pdfJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            pdfIds.push(pdfJson.typeId)
        }
    }))
    var pdfCondition = { status: 0, [Op.or]: [{ delete: 0 }, { pdf_id: { [Op.in]: pdfIds } }] };


    //PPT purchase check
    [err, pptCount] = await to(TOA_student_purchase.findAll({ where: { type: 7, student_id: studentId } }));
    if (err) TE(err.message);
    var pptIds = [];
    await Promise.all(pptCount.map(async (course) => {
        var pptJson = course.toJSON();
        var newDate = moment(pptJson.createdAt).add(pptJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            pptIds.push(pptJson.typeId)
        }
    }))
    var pptCondition = { status: 0, [Op.or]: [{ delete: 0 }, { ppt_id: { [Op.in]: pptIds } }] };

    //Audio purchase check
    [err, audioCount] = await to(TOA_student_purchase.findAll({ where: { type: 8, student_id: studentId } }));
    if (err) TE(err.message);
    var audioIds = [];
    await Promise.all(audioCount.map(async (course) => {
        var audioJson = course.toJSON();
        var newDate = moment(audioJson.createdAt).add(audioJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            audioIds.push(audioJson.typeId)
        }
    }))
    var audioCondition = { status: 0, [Op.or]: [{ delete: 0 }, { audio_id: { [Op.in]: audioIds } }] };

    //Video purchase check
    [err, videoCount] = await to(TOA_student_purchase.findAll({ where: { type: 9, student_id: studentId } }));
    if (err) TE(err.message);
    var videoIds = [];
    await Promise.all(videoCount.map(async (course) => {
        var videoJson = course.toJSON();
        var newDate = moment(videoJson.createdAt).add(videoJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            videoIds.push(videoJson.typeId)
        }
    }))
    var videoCondition = { status: 0, [Op.or]: [{ delete: 0 }, { video_id: { [Op.in]: videoIds } }] };



    [err, contentList] = await to(TOA_content.findOne({

        where: { status: 0, content_id: contentId },

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
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
                // where: { status: 0, delete: 0 },
                where: pdfCondition,
                as: 'pdf',
                required: false,
                raw: false,
                attributes: [['pdf_id', 'id'], ['pdf_title', 'title'], ['pdf_url', 'url'], ['pdf_type', 'isPaid'], 'paymentgateway_id', 'validity', ['pdf_amount', 'amount'], ['pdf_preview', 'preview'], 'downloadable', 'status'],
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
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
                // where: { status: 0, delete: 0 },
                where: pptCondition,
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
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
                    },
                ]
            },
            {
                model: TOA_audio,
                // where: { status: 0, delete: 0 },
                where: audioCondition,
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
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
                // where: { status: 0, delete: 0 },
                where: videoCondition,
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
                        attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
// module.exports.getPracticeList = async function (contentId) {
module.exports.getPracticeList = async function (contentId, studentId) {

    let today = moment().format();

    //Practice purchase check
    [err, practiceCount] = await to(TOA_student_purchase.findAll({ where: { type: 5, student_id: studentId } }));
    if (err) TE(err.message);
    var practiceIds = [];
    await Promise.all(practiceCount.map(async (course) => {
        var practiceJson = course.toJSON();
        var newDate = moment(practiceJson.createdAt).add(practiceJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            practiceIds.push(practiceJson.typeId)
        }
    }))
    var practiceCondition = { status: 0, content_id: contentId, [Op.or]: [{ delete: 0 }, { practice_id: { [Op.in]: practiceIds } }] };


    [err, practiceList] = await to(TOA_practice.findAll({

        // where: { status: 0, content_id: contentId },
        where: practiceCondition,
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

    let today = moment().format();

    //Test purchase check
    [err, testCount] = await to(TOA_student_purchase.findAll({ where: { type: 4, student_id: studentId } }));
    if (err) TE(err.message);
    var testIds = [];
    await Promise.all(testCount.map(async (course) => {
        var testJson = course.toJSON();
        var newDate = moment(testJson.createdAt).add(testJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            testIds.push(testJson.typeId)
        }
    }))
    var testCondition = { status: 0, content_id: contentId, [Op.or]: [{ delete: 0 }, { test_id: { [Op.in]: testIds } }] };


    [err, testList] = await to(TOA_test.findAll({
        // where: { status: 0, content_id: contentId },
        where: testCondition,
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
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
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
                where: { type: 1, student_id: studentId },
                // attributes: [],
                required: false,

            },
        ]
    }
    ));

    if (err) TE(err.message);
    return coursesList;
}