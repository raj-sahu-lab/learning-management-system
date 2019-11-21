const { TOA_student_purchase, TOA_currency, TOA_subject, TOA_topic, TOA_content, TOA_test, TOA_test_question, TOA_paymentgateway, TOA_ios_paymentgateway, TOA_branch, TOA_practice, TOA_practice_question, TOA_test_student_answer, TOA_test_result } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
var moment = require('moment');

module.exports.getTestList = async function (branchId, studentId) {

    let today = moment().format();

    [err, listIds] = await to(TOA_student_purchase.findAll({ where: { type: 4, student_id: studentId } }));
    if (err) TE(err.message);
    var testIds = [];

    await Promise.all(listIds.map(async (course) => {
        var testJson = course.toJSON();
        var newDate = moment(testJson.createdAt).add(testJson.dayLimit, 'days').toISOString();
        console.log("testJson", testJson);
        if (newDate >= today) {
            testIds.push(testJson.typeId);
        }
    }))

    var condition = { status: 0, branch_id: branchId, [op.or]: [{ delete: 0 }, { test_id: { [op.in]: testIds } }] };


    [err, testList] = await to(TOA_test.findAll({

        // where: { branch_id: branchId, status: 0, delete: 0 },
        where: condition,
        attributes: [

            ['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_type', 'isPaid'], 'paymentgateway_id', ['test_amount', 'amount'], ['test_preview', 'preview'], ['test_timed', 'timedTest'], ['test_duration', 'duration'], ['test_total_mark', 'totalMarks'], 'status',
            [Sequelize.fn('count', Sequelize.col('test_question_id')), 'questionCount']

        ],
        include: [
            {

                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth'], ['paymentgateway_authsecret', 'secret']],
            },
            {
                model: TOA_ios_paymentgateway,
                as: 'iosPaymentGateWay',
                attributes: ['id', 'title', 'inAppId', 'inAppamount'],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            },
            {

                model: TOA_test_question,
                as: 'question_list',
                attributes: [],

            },
            {

                model: TOA_branch,
                as: 'branch',
                where: { status: 0, delete: 0 },
                attributes: [],

            },
            {

                model: TOA_subject,
                as: 'subject',
                where: { status: 0, delete: 0 },
                attributes: [],

            },
            {

                model: TOA_topic,
                as: 'topic',
                where: { status: 0, delete: 0 },
                attributes: [],

            },
            {

                model: TOA_content,
                as: 'content',
                where: { status: 0, delete: 0 },
                attributes: [],

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
        order: [['test_id', 'DESC']]

    }));
    if (err) TE(err.message);
    return testList;
}
module.exports.getTestQuestionList = async function (testId) {

    [err, test] = await to(TOA_test_question.findAll({

        where: { test_id: testId, status: 0, delete: 0 },
        order: [['test_question_id', 'ASC']],
        attributes: [
            ['test_question_id', 'id'],
            ['test_question', 'question'],
            ['test_question_type', 'questionType'],
            ['test_question_answer1', 'answer1'],
            ['test_question_answer2', 'answer2'],
            ['test_question_answer3', 'answer3'],
            ['test_question_answer4', 'answer4'],
            ['test_question_time', 'time'],
            ['test_question_mark', 'mark'],
            ['test_question_answer', 'answer'],
            ['test_question_explanation', 'explanation'],
            ['test_question_video', 'video']
        ]

    }));
    if (err) TE(err.message);
    return test;
}

module.exports.getPracticeQuestionList = async function (practiceId) {

    [err, questionList] = await to(TOA_practice_question.findAll({

        where: { practice_id: practiceId, status: 0, delete: 0 },
        order: [['practice_question_id', 'ASC']],
        attributes: [
            ['practice_question_id', 'id'],
            ['practice_question_question', 'question'],
            ['practice_question_answer', 'answer']
        ]

    }));
    if (err) TE(err.message);
    return questionList;
}
module.exports.addQuestionsAnswers = async function (answers) {

    [err, answerList] = await to(TOA_test_student_answer.bulkCreate(answers));
    if (err) TE(err.message);
    return answerList;
}

module.exports.addTestResult = async function (testResult) {

    [err, testResult] = await to(TOA_test_result.create(testResult));
    if (err) TE(err.message);
    return testResult;
}

module.exports.getTestResult = async function (testId, studentId) {

    [err, test] = await to(TOA_test.findOne({

        where: { test_id: testId, status: 0, delete: 0 },
        attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_type', 'isPaid'], 'paymentgateway_id', ['test_amount', 'amount'], ['test_preview', 'preview'], ['test_timed', 'timedTest'], ['test_duration', 'duration'], ['test_total_mark', 'totalMarks']],
        include: [
            {
                model: TOA_test_result,
                as: 'testResult',
                where: { student_id: studentId },
                attributes: ['correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', ['createdAt', 'appeared']],
            }
        ]

    }));
    if (err) TE(err.message);
    return test;
}


module.exports.getTestQuestionResultList = async function (testId, studentId) {

    [err, test] = await to(TOA_test_question.findAll({

        where: { test_id: testId, status: 0, delete: 0 },
        attributes: [

            ['test_question_id', 'id'],
            ['test_question', 'question'],
            ['test_question_answer', 'answer'],
            ['test_question_explanation', 'explanation']
        ],
        include: [
            {
                model: TOA_test_student_answer,
                as: 'studentAnswer',
                where: { student_id: studentId },
                attributes: [['test_answer', 'answer'], ['test_question_taken_time', 'takenTime']],
                required: false
            }
        ]
    }));
    if (err) TE(err.message);
    return test;
}

module.exports.getTestResultList = async function (studentId) {

    [err, testResultList] = await to(TOA_test_result.findAll({

        where: { student_id: studentId },
        attributes: ['id', 'correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', 'createdAt'],
        include: [
            {
                model: TOA_test,
                as: 'test',
                attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_type', 'isPaid'], 'paymentgateway_id', ['test_amount', 'amount'], ['test_preview', 'preview'], ['test_timed', 'timedTest'], ['test_duration', 'duration'], ['test_total_mark', 'totalMarks']],
            }
        ]

    }));
    if (err) TE(err.message);
    return testResultList;

}