const { TOA_currency,TOA_paymentgateway, TOA_ios_paymentgateway, TOA_testbundle_Bundle, TOA_testbundle_Bundle_Set, TOA_testbundle_Set, TOA_testbundle_Set_Series, TOA_testbundle_question, TOA_testbundle_question_options, TOA_subject, TOA_testbundle_Test_Series, TOA_testbundle_Test_Series_Questions } = require('../../../models');
const { to, TE } = require('../util.service');


// Test Bundle Count
module.exports.bundleCounts = async function (accountId) {

    [err, questionCount] = await to(TOA_testbundle_question.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    [err, seriesCount] = await to(TOA_testbundle_Test_Series.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    [err, setCount] = await to(TOA_testbundle_Set.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    [err, bundleCount] = await to(TOA_testbundle_Bundle.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    return { questionCount: questionCount, seriesCount: seriesCount, setCount: setCount, bundleCount: bundleCount };
}

// Question
module.exports.addBundleQuestion = async function (question) {

    [err, quesion] = await to(TOA_testbundle_question.create(question));
    if (err) TE(err.message);
    return quesion;

}

module.exports.addBundleQuestionOptions = async function (options) {

    [err, options] = await to(TOA_testbundle_question_options.bulkCreate(options));
    if (err) TE(err.message);
    return options;
}

module.exports.getBundleQuestion = async function (id) {

    [err, bundleQuestion] = await to(TOA_testbundle_question.findOne({

        where: { id: id, delete: 0 },
        attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration', 'status'],
        include: [
            {

                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
            },
            {
                model: TOA_testbundle_question_options,
                as: 'options',
                attributes: ['id', 'option', 'optionMedia', 'isAnswer'],
            }
        ]
    }));
    if (err) TE(err.message);
    return bundleQuestion;
}

module.exports.getBundleQuestionList = async function (accountId, pageNo, pageLimit, questionType) {

    let whereClause = { delete: 0, accountId: accountId };
    if (questionType) {

        whereClause.question_type = questionType;
    }

    [err, bundleQuestion] = await to(TOA_testbundle_question.findAll({
        where: whereClause,
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration', 'status'],
        include: [
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
            },
            {
                model: TOA_testbundle_question_options,
                as: 'options',
                attributes: ['id', 'option', 'optionMedia', 'isAnswer'],
            }
        ]

    }));
    if (err) TE(err.message);
    return bundleQuestion;
}

module.exports.updateBundleQuestion = async function (questionId, updateJSON) {

    [err, update] = await to(TOA_testbundle_question.update(updateJSON, { where: { id: questionId } }));
    if (err) TE(err.message);
    return update;
}

module.exports.getBundleQuestionListByTypes = async function (accountId, pageNo, pageLimit, selectedTypes) {

    [err, bundleQuestion] = await to(TOA_testbundle_question.findAll({
        where: { delete: 0, accountId: accountId, question_type: selectedTypes },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id', 'question', 'question_type', 'questionMedia', 'mark', 'duration', 'status'],
        include: [
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
            },
            {
                model: TOA_testbundle_question_options,
                as: 'options',
                attributes: ['id', 'option', 'optionMedia', 'isAnswer'],
            }
        ]

    }));
    if (err) TE(err.message);
    return bundleQuestion;
}

// Series
module.exports.addBundleQuestionSeries = async function (series) {

    [err, series] = await to(TOA_testbundle_Test_Series.create(series));
    if (err) TE(err.message);
    return series;
}

module.exports.updateBundleSeries = async function (seriesId, updateJSON) {

    [err, update] = await to(TOA_testbundle_Test_Series.update(updateJSON, { where: { id: seriesId } }));
    if (err) TE(err.message);
    return update;
}

module.exports.addBundleQuestionSeriesQuestions = async function (seriesQuestions) {

    [err, questionsList] = await to(TOA_testbundle_Test_Series_Questions.bulkCreate(seriesQuestions));
    if (err) TE(err.message);
    return questionsList;
}

module.exports.getSeriesQuestion = async function (seriesId, questionId) {

    [err, questionsList] = await to(TOA_testbundle_Test_Series_Questions.findOne({
        where: { testSeriesId: seriesId, questionId: questionId },
    }));
    if (err) TE(err.message);
    return questionsList;
}

module.exports.getBundleSeries = async function (accountId, seriesId) {

    [err, bundleQuestion] = await to(TOA_testbundle_Test_Series.findOne({
        where: { delete: 0, accountId: accountId, id: seriesId },
        attributes: ['id', 'title', "preview", "timed", "timeEqual", "duration", "marked", "markEqual", "totalMarks", 'status'],
        include: [
            {
                model: TOA_testbundle_Test_Series_Questions,
                as: 'questionList',
                attributes: ['id'],
                required: false,
                include: [
                    {
                        required: false,
                        model: TOA_testbundle_question,
                        as: 'question',
                        where: { status: 0, delete: 0 },
                        attributes: ['id', 'question', 'questionMedia', 'question_type', 'mark', 'duration'],
                    }
                ],

            }
        ]

    }));
    if (err) TE(err.message);
    return bundleQuestion;
}

module.exports.getBundleSeriesList = async function (accountId, pageNo, pageLimit) {

    [err, bundleQuestion] = await to(TOA_testbundle_Test_Series.findAll({
        where: { delete: 0, accountId: accountId },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id', 'title', "preview", "timed", "timeEqual", "duration", "marked", "markEqual", "totalMarks", 'status'],
        include: [
            {
                model: TOA_testbundle_Test_Series_Questions,
                as: 'questionList',
                attributes: ['id'],
                required: false,
                include: [
                    {
                        required: false,
                        model: TOA_testbundle_question,
                        as: 'question',
                        where: { status: 0, delete: 0 },
                        attributes: ['id', 'question', 'questionMedia', 'question_type', 'mark', 'duration'],
                    }
                ],

            }
        ]

    }));
    if (err) TE(err.message);
    return bundleQuestion;
}

module.exports.deleteBundleSeriesQuestion = async function (seriesQuestionId) {

    [err, result] = await to(TOA_testbundle_Test_Series_Questions.destroy({
        where: { id: seriesQuestionId }
    }));
    if (err) TE(err.message);
    return result;
}

// Set
module.exports.addSeriesSet = async function (setJSON) {

    [err, createdSet] = await to(TOA_testbundle_Set.create(setJSON));
    if (err) TE(err.message);
    return createdSet;
}

module.exports.addSeriesInToSet = async function (setSeriesList) {

    [err, seriesSetList] = await to(TOA_testbundle_Set_Series.bulkCreate(setSeriesList));
    if (err) TE(err.message);
    return seriesSetList;
}

module.exports.getSeriesSet = async function (accountId, setId) {

    [err, set] = await to(TOA_testbundle_Set.findOne({
        where: { delete: 0, accountId: accountId, id: setId },
        attributes: ['id', 'title', 'status'],
        include: [
            {
                model: TOA_testbundle_Set_Series,
                as: 'seriesList',
                attributes: ['id'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Test_Series,
                        as: 'series',
                        attributes: ['id', 'title'],
                        required: false,
                    }
                ]
            }
        ]

    }));
    if (err) TE(err.message);
    return set;
}

module.exports.getSetSeriesList = async function (accountId, pageNo, pageLimit) {

    [err, setList] = await to(TOA_testbundle_Set.findAll({
        where: { delete: 0, accountId: accountId },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id', 'title', 'status'],
        include: [
            {
                model: TOA_testbundle_Set_Series,
                as: 'seriesList',
                attributes: ['id'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Test_Series,
                        as: 'series',
                        attributes: ['id', 'title'],
                        required: false,
                    }
                ]
            }
        ]

    }));
    if (err) TE(err.message);
    return setList;
}

module.exports.updateSet = async function (setId, updateJSON) {

    [err, update] = await to(TOA_testbundle_Set.update(updateJSON, { where: { id: setId } }));
    if (err) TE(err.message);
    return update;
}

module.exports.getSetSeries = async function (setId, seriesId) {

    [err, setSeriesList] = await to(TOA_testbundle_Set_Series.findOne({
        where: { setId: setId, seriesId: seriesId },
    }));
    if (err) TE(err.message);
    return setSeriesList;
}

module.exports.deleteSeriesFromSet = async function (setSeriesId) {

    [err, result] = await to(TOA_testbundle_Set_Series.destroy({
        where: { id: setSeriesId }
    }));
    if (err) TE(err.message);
    return result;
}


// Bundle
module.exports.addBundle = async function (bundleJSON) {

    [err, createdBundle] = await to(TOA_testbundle_Bundle.create(bundleJSON));
    if (err) TE(err.message);
    return createdBundle;
}

module.exports.addSetIntoBundle = async function (bundleSetList) {

    [err, bundleSetListResult] = await to(TOA_testbundle_Bundle_Set.bulkCreate(bundleSetList));
    if (err) TE(err.message);
    return bundleSetListResult;
}

module.exports.getBundle = async function (accountId, bundleId) {

    [err, bundle] = await to(TOA_testbundle_Bundle.findOne({
        where: { delete: 0, accountId: accountId, id: bundleId },
        attributes: ['id', 'title', 'isPublished', 'isPaid', 'paymentGateWayId', 'amount', 'validity', 'preview', 'status'],
        include: [
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id' , 'id'] ,['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
                required: false,
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id' , 'title' , 'sign' , 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {
                model: TOA_testbundle_Bundle_Set,
                as: 'setList',
                attributes: ['id'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Set,
                        as: 'set',
                        attributes: ['id', 'title'],
                        required: false,
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return bundle;
}

module.exports.getBundleList = async function (accountId, pageNo, pageLimit) {

    [err, bundleList] = await to(TOA_testbundle_Bundle.findAll({
        where: { delete: 0, accountId: accountId },
        limit: pageLimit,
        offset: (0 + (pageNo - 1) * pageLimit),
        order: [['id', 'DESC']],
        attributes: ['id', 'title', 'isPublished', 'isPaid', 'paymentGateWayId', 'validity', 'amount', 'preview', 'status'],
        include: [
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id' , 'id'] ,['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
                required: false,
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id' , 'title' , 'sign' , 'code'],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id' , 'title', 'inAppId' , 'inAppamount'],
            },
            {
                model: TOA_testbundle_Bundle_Set,
                as: 'setList',
                attributes: ['id'],
                required: false,
                include: [
                    {
                        model: TOA_testbundle_Set,
                        as: 'set',
                        attributes: ['id', 'title'],
                        required: false,
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return bundleList;
}

module.exports.updateBundle = async function (bundleId, updateJSON) {

    [err, update] = await to(TOA_testbundle_Bundle.update(updateJSON, { where: { id: bundleId } }));
    if (err) TE(err.message);
    return update;
}

module.exports.getBundleSet = async function (bundleId, setId) {

    [err, bundleSetList] = await to(TOA_testbundle_Bundle_Set.findOne({
        where: { bundleId: bundleId, setId: setId },
    }));
    if (err) TE(err.message);
    return bundleSetList;
}

module.exports.deleteSetFromBundle = async function (bundleSetId) {

    [err, result] = await to(TOA_testbundle_Bundle_Set.destroy({
        where: { id: bundleSetId }
    }));
    if (err) TE(err.message);
    return result;
}