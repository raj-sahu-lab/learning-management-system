const { TOA_student_purchase, TOA_currency, TOA_testbundle_student_answer, TOA_ios_paymentgateway, TOA_testbundle_student_result, TOA_paymentgateway, TOA_testbundle_Bundle, TOA_testbundle_Bundle_Set, TOA_testbundle_Set, TOA_testbundle_Set_Series, TOA_testbundle_question, TOA_testbundle_question_options, TOA_subject, TOA_testbundle_Test_Series, TOA_testbundle_Test_Series_Questions } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
var moment = require('moment');


// Bundle Listing
module.exports.getBundleList = async function (accountId, pageNo, pageLimit, studentId) {

    let today = moment().format();

    [err, listIds] = await to(TOA_student_purchase.findAll({ where: { type: 10, student_id: studentId } }));
    if (err) TE(err.message);

    var bundleIds = [];

    await Promise.all(listIds.map(async (course) => {
        var bundleJson = course.toJSON();
        var newDate = moment(bundleJson.createdAt).add(bundleJson.dayLimit, 'days').toISOString();
        if (newDate >= today) {
            bundleIds.push(bundleJson.typeId);
        }
    }))

    var condition = { status: 0, accountId: accountId, isPublished: 1, [op.or]: [{ delete: 0 }, { id: { [op.in]: bundleIds } }] };


    [err, bundleList] = await to(TOA_testbundle_Bundle.findAll({
        // where: { delete: 0, accountId: accountId, isPublished: 1 },
        where: condition,
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        group: ['setList.id'],
        subQuery: false,
        attributes: [
            'id', 'title', 'isPaid', 'paymentGateWayId', 'amount', 'validity', 'preview',
            [Sequelize.fn("COUNT", Sequelize.col('setList.bundleId')), "setCount"]
        ],
        include: [
            {
                model: TOA_testbundle_Bundle_Set,
                as: 'setList',
                attributes: [],
                required: false,
                // include: [
                //     {
                //         model: TOA_testbundle_Set,
                //         as: 'set',
                //         attributes: ['id', 'title'],
                //         required: false,
                //     }
                // ]
            },
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth'], ['paymentgateway_authsecret', 'secret']],
                required: false,
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
    }));
    if (err) TE(err.message);
    return bundleList;
}

// Set Listing
module.exports.getBundleSetList = async function (accountId, pageNo, pageLimit, bundleId) {

    [err, setList] = await to(TOA_testbundle_Bundle_Set.findAll({
        where: { bundleId: bundleId },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: [
            {
                model: TOA_testbundle_Bundle,
                as: 'bundle',
                attributes: [],
                where: { accountId: accountId, delete: 0 }

            },
            {
                model: TOA_testbundle_Set,
                as: 'set',
                attributes: ['id', 'title'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Set_Series,
                        as: 'seriesList',
                        required: false,
                    }
                ]
            }
        ],
    }));
    if (err) TE(err.message);
    return setList;
}


// Series Listing
module.exports.getBundleSeriesList = async function (accountId, pageNo, pageLimit, setId, studentId) {

    [err, seriesList] = await to(TOA_testbundle_Set_Series.findAll({
        where: { setId: setId },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: [
            {
                model: TOA_testbundle_Set,
                as: 'set',
                attributes: [],
                where: { accountId: accountId, delete: 0 }

            },
            {
                model: TOA_testbundle_Test_Series,
                as: 'series',
                attributes: ['id', 'title', "preview", "timed", "timeEqual", "duration", "marked", "markEqual", "totalMarks"],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_student_result,
                        as: 'studentAnswer',
                        where: { studentId: studentId },
                        attributes: ['id', 'correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', ['createdAt', 'attemptedAt']],
                        required: false,
                    },
                    {
                        model: TOA_testbundle_Test_Series_Questions,
                        as: 'questionList',
                        include: [
                            {
                                model: TOA_testbundle_question,
                                as: 'question'
                            }
                        ]
                    }
                ]
            }
        ]

    }));
    if (err) TE(err.message);
    return seriesList;
}


// Series Listing
module.exports.getBundleQuestionList = async function (accountId, pageNo, pageLimit, seriesId) {

    [err, seriesList] = await to(TOA_testbundle_Test_Series_Questions.findAll({
        where: { testSeriesId: seriesId },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'ASC']],
        attributes: ['id'],
        include: [
            {
                model: TOA_testbundle_Test_Series,
                as: 'testSeries',
                attributes: [],
                where: { accountId: accountId, delete: 0 }

            },
            {
                model: TOA_testbundle_question,
                as: 'question',
                where: { status: 0, delete: 0 },
                attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_question_options,
                        as: 'options',
                        attributes: ['id', 'option', 'optionMedia', 'isAnswer'],
                    }
                ]
            }
        ]

    }));
    if (err) TE(err.message);
    return seriesList;
}


// Series Listing
module.exports.getBundleSeries = async function (seriesId) {

    [err, series] = await to(TOA_testbundle_Test_Series.findOne({
        where: { id: seriesId },
        attributes: ['id', 'title', "preview", "timed", "timeEqual", "duration", "marked", "markEqual", "totalMarks"],
    }));
    if (err) TE(err.message);
    return series;
}

// Series Listing
module.exports.getSeriesQuestionList = async function (accountId, seriesId) {

    [err, seriesList] = await to(TOA_testbundle_Test_Series_Questions.findAll({
        where: { testSeriesId: seriesId },
        order: [['id', 'ASC']],
        attributes: ['id'],
        include: [
            {
                model: TOA_testbundle_Test_Series,
                as: 'testSeries',
                attributes: [],
                where: { accountId: accountId, delete: 0 }

            },
            {
                model: TOA_testbundle_question,
                as: 'question',
                where: { status: 0, delete: 0 },
                attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_question_options,
                        as: 'options',
                        where: { isAnswer: 1 },
                        attributes: ['id', 'option', 'optionMedia'],
                    }
                ]
            }
        ]

    }));
    if (err) TE(err.message);
    return seriesList;
}

// Add Series Result
module.exports.addSeriesResult = async function (bundleResult) {

    [err, createdBundleResult] = await to(TOA_testbundle_student_result.create(bundleResult));
    if (err) TE(err.message);
    return createdBundleResult;
}

// Update the Series Result
module.exports.updateSeriesResult = async function (bundleResultId, updateJSON) {

    [err, bundleUpdateResult] = await to(TOA_testbundle_student_result.update(updateJSON, { where: { id: bundleResultId } }));
    if (err) TE(err.message);
    return bundleUpdateResult;
}

// Add Student Selected answer
module.exports.addBundleSeriesAnswer = async function (bundleAnswerList) {

    [err, answerList] = await to(TOA_testbundle_student_answer.bulkCreate(bundleAnswerList));
    if (err) TE(err.message);
    return answerList;
}

// Get All Result List
module.exports.getBundleResultList = async function (accountId, studentId) {

    [err, resultList] = await to(TOA_testbundle_student_result.findAll({

        where: { accountId: accountId, studentId: studentId },
        attributes: ['id', 'correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', ['createdAt', 'attemptedAt']],
        include: [
            {
                model: TOA_testbundle_Bundle,
                as: 'bundle',
                attributes: ['id', 'title', 'isPaid', 'paymentGateWayId', 'amount', 'validity', 'preview'],
                required: false,
            },
            {
                model: TOA_testbundle_Test_Series,
                as: 'series',
                attributes: ['id', 'title', "preview", "timed", "timeEqual", "duration", "marked", "markEqual", "totalMarks"],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Test_Series_Questions,
                        as: 'questionList',
                        attributes: ['id'],
                        include: [
                            {
                                model: TOA_testbundle_question,
                                as: 'question',
                                attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration'],
                                required: false,
                                include: [
                                    {
                                        model: TOA_testbundle_question_options,
                                        as: 'options',
                                        attributes: ['id', 'option', 'optionMedia', 'isAnswer'],
                                    },
                                    {
                                        model: TOA_testbundle_student_answer,
                                        as: 'studentAnswers',
                                        where: { studentResultId: { [op.col]: 'TOA_testbundle_student_result.id' }, studentId: studentId },
                                        attributes: ['id', 'questionId', 'questionAnswerId', 'takenTime'],
                                        required: false,
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        ]
    }));

    if (err) TE(err.message);
    return resultList;
}

// Get Single Result Detail
module.exports.getBundleResult = async function (accountId, studentId, resultId) {


    [err, resultList] = await to(TOA_testbundle_student_result.findOne({

        where: { id: resultId, accountId: accountId, studentId: studentId },
        attributes: ['id', 'correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', ['createdAt', 'attemptedAt']],
        include: [
            {
                model: TOA_testbundle_Bundle,
                as: 'bundle',
                attributes: ['id', 'title', 'isPaid', 'paymentGateWayId', 'amount', 'validity', 'preview'],
                required: false,
            },
            {
                model: TOA_testbundle_Test_Series,
                as: 'series',
                attributes: ['id', 'title', "preview", "timed", "timeEqual", "duration", "marked", "markEqual", "totalMarks"],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Test_Series_Questions,
                        as: 'questionList',
                        attributes: ['id'],
                        include: [
                            {
                                model: TOA_testbundle_question,
                                as: 'question',
                                attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration'],
                                required: false,
                                include: [
                                    {
                                        model: TOA_testbundle_question_options,
                                        as: 'options',
                                        attributes: ['id', 'option', 'optionMedia', 'isAnswer'],
                                    },
                                    {
                                        model: TOA_testbundle_student_answer,
                                        as: 'studentAnswers',
                                        where: { studentResultId: { [op.col]: 'TOA_testbundle_student_result.id' }, studentId: studentId },
                                        attributes: ['id', 'questionId', 'questionAnswerId', 'takenTime'],
                                        required: false,
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        ]
    }));

    if (err) TE(err.message);
    return resultList;
}