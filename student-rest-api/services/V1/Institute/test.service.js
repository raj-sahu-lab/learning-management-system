const { TOA_set, TOA_currency ,TOA_tutor,TOA_ios_paymentgateway, TOA_student_institute_relationship, TOA_student, TOA_test_student_answer, TOA_branch, TOA_paymentgateway, TOA_test, TOA_test_result, TOA_test_question, TOA_subject, TOA_topic, TOA_content, TOA_practice, TOA_practice_question, TOA_testbundle_question } = require('../../../models');
const { to, TE } = require('../util.service');


// ---------------------------------------------- SET ---------------------------------------------- 

// Create new SET
const createSet = async function (set) {

    [err, set] = await to(TOA_set.create(set));
    if (err) TE(err.message);
    return set;
}
module.exports.createSet = createSet;

// Update SET
const updateSet = async function (setId, setJson) {

    [err, set] = await to(TOA_set.update(setJson, { where: { set_id: setId } }));
    if (err) TE(err.message);
    return set;
}
module.exports.updateSet = updateSet;

// Get All Test
const getSet = async function (accountId, setId) {

    [err, set] = await to(TOA_set.findOne({

        where: { account_id: accountId, set_id: setId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['set_id', 'id'], ['set_title', 'title'], ['set_instruction', 'instruction'], 'status'],
        include: [
            {
                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
            },
            {
                model: TOA_topic,
                where: { account_id: accountId, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title']],
            }]
    }));
    if (err) TE(err.message);
    return set;
}
module.exports.getSet = getSet;

// Get All Set  List
const getSetList = async function (accountId) {

    [err, setList] = await to(TOA_set.findAll({

        where: { account_id: accountId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['set_id', 'id'], ['set_title', 'title'], ['set_instruction', 'instruction'], 'status'],
        include: [
            {
                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
            },
            {
                model: TOA_topic,
                where: { account_id: accountId, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title']],
            }]
    }));
    if (err) TE(err.message);
    return setList;
}
module.exports.getSetList = getSetList;

// Delete Set
const deleteSet = async function (accountId, setId) {

    const setJson = { delete: 1 };
    [err, set] = await to(TOA_set.update(setJson, { where: { account_id: accountId, set_id: setId } }));
    if (err) TE(err.message);
    return set;
}
module.exports.deleteSet = deleteSet;

// ---------------------------------------------- SET ---------------------------------------------- 


// ---------------------------------------------- Test ---------------------------------------------- 

// Add New Test
const addNewTest = async function (testData) {

    [err, test] = await to(TOA_test.create(testData));
    if (err) TE(err.message);
    return test;
}
module.exports.addNewTest = addNewTest;

// Get Single Test
const getTest = async function (accountId, testId) {

    [err, test] = await to(TOA_test.findOne({

        where: { test_id: testId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_timed', 'timedTest'], ['test_duration', 'testDuration'], ['test_total_mark', 'totalMarks'], ['test_amount', 'amount'], ['test_preview', 'preview'], 'status'],
        include: [

            {
                model: TOA_test_question,
                as: 'question_list',
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
                    ['test_question_video', 'video'],
                    'status'
                ]
            },
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id' , 'id'] ,['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
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

                model: TOA_subject,
                where: { status: 0, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
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
                where: { status: 0, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title']],

            },
            {
                model: TOA_content,
                where: { status: 0, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title']],
            },
        ]
    }));
    if (err) TE(err.message);
    return test;
}
module.exports.getTest = getTest;


// Get Single Test
const getAllTest = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, testList] = await to(TOA_test.findAll({

        where: { account_id: user.account_id, delete: 0 },
        order: [['test_id', 'DESC']],
        attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_timed', 'timedTest'], ['test_duration', 'testDuration'], ['test_total_mark', 'totalMarks'], ['test_amount', 'amount'], ['test_preview', 'preview'], 'status'],
        include: [
            {

                model: TOA_subject,
                where: { status: 0, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
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
                where: { status: 0, delete: 0 },
                as: 'topic',
                attributes: [['topic_id', 'id'], ['topic_title', 'title']],

            },
            {
                model: TOA_content,
                where: { status: 0, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title']],
            },
            {
                model: TOA_test_question,
                as: 'question_list',
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
                    ['test_question_video', 'video'],
                    'status'
                ]
            },
            {
                model: TOA_paymentgateway,
                as: 'payment_type',
                attributes: [['paymentgateway_id' , 'id'] ,['paymentgateway_title', 'title'], ['paymentgateway_authkey', 'key'], ['paymentgateway_authkey', 'auth']],
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
        ]
    }));
    if (err) TE(err.message);
    return testList;
}
module.exports.getAllTest = getAllTest;

// Delete Test
const deleteTest = async function (accountId, testId) {

    const testJson = { delete: 1 };
    [err, test] = await to(TOA_test.update(testJson, { where: { account_id: accountId, test_id: testId } }));
    if (err) TE(err.message);
    return test;
}
module.exports.deleteTest = deleteTest;

// ---------------------------------------------- Test ---------------------------------------------- 


// ---------------------------------------------- Test Question---------------------------------------------- 

const addQuestions = async function (questions) {

    [err, questionsList] = await to(TOA_test_question.bulkCreate(questions));
    if (err) TE(err.message);
    return questionsList;
}
module.exports.addQuestions = addQuestions;

// ---------------------------------------------- Test Question---------------------------------------------- 


// ---------------------------------------------- Practice ---------------------------------------------- 

// Add New Practice
const addNewpractice = async function (practiceData) {

    [err, practice] = await to(TOA_practice.create(practiceData));
    if (err) TE(err.message);
    return practice;
}
module.exports.addNewpractice = addNewpractice;

// Get Single Test
const getPractice = async function (accountId, practiceId) {

    [err, practice] = await to(TOA_practice.findOne({

        where: { practice_id: practiceId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['practice_id', 'id'], ['practice_title', 'title'], 'status'],
        include: [
            {
                model: TOA_practice_question,
                as: 'question_list',
                attributes: [
                    ['practice_question_id', 'id'],
                    ['practice_question_question', 'question'],
                    ['practice_question_answer', 'answer'],
                    'status'
                ]
            },
            {

                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
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
                attributes: [['topic_id', 'id'], ['topic_title', 'title']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title']],
            }
        ]
    }));
    if (err) TE(err.message);
    return practice;
}
module.exports.getPractice = getPractice;


// Get Practice List
const getPracticeList = async function (accountId) {

    [err, practiceList] = await to(TOA_practice.findAll({

        where: { account_id: accountId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['practice_id', 'id'], ['practice_title', 'title'], 'status'],
        include: [
            {
                model: TOA_practice_question,
                as: 'question_list',
                attributes: [
                    ['practice_question_id', 'id'],
                    ['practice_question_question', 'question'],
                    ['practice_question_answer', 'answer'],
                    'status'
                ]
            },
            {

                model: TOA_subject,
                where: { account_id: accountId, delete: 0 },
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
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
                attributes: [['topic_id', 'id'], ['topic_title', 'title']],
            },
            {
                model: TOA_content,
                where: { account_id: accountId, delete: 0 },
                as: 'content',
                attributes: [['content_id', 'id'], ['content_title', 'title']],
            }
        ]
    }));
    if (err) TE(err.message);
    return practiceList;
}
module.exports.getPracticeList = getPracticeList;

// Delete Test
const deletePractice = async function (accountId, practiceId) {

    const practiceJson = { delete: 1 };
    [err, practice] = await to(TOA_practice.update(practiceJson, { where: { account_id: accountId, practice_id: practiceId } }));
    if (err) TE(err.message);
    return practice;
}
module.exports.deletePractice = deletePractice;

// ---------------------------------------------- Practice ---------------------------------------------- 


// ---------------------------------------------- Practice Question ---------------------------------------------- 

const addPracticeQuestions = async function (questions) {

    [err, questionsList] = await to(TOA_practice_question.bulkCreate(questions));
    if (err) TE(err.message);
    return questionsList;
}
module.exports.addPracticeQuestions = addPracticeQuestions;

// ---------------------------------------------- Practice Question ---------------------------------------------- 


// ---------------------------------------------- Test Result ---------------------------------------------- 

module.exports.getStudentTestResultList = async function (user) {

    var whereTutorJson = { delete: 0 };
    if (user.userType == 3) {
        whereTutorJson.tutor_id = user.id;
    }

    [err, testResultList] = await to(TOA_test_result.findAll({

        attributes: ['id', 'correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', 'createdAt'],
        include: [
            {
                model: TOA_test,
                as: 'test',
                where: { account_id: user.account_id },
                attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_type', 'isPaid'], 'paymentgateway_id', ['test_amount', 'amount'], ['test_preview', 'preview'], ['test_timed', 'timedTest'], ['test_duration', 'duration'], ['test_total_mark', 'totalMarks']],
                include: [
                    {
                        model: TOA_subject,
                        as: 'subject',
                        where: whereTutorJson,
                        attributes: []
                    }]
            },
            {

                model: TOA_student,
                as: 'student',
                attributes: ['id', 'first_name', 'last_name'],
            }
        ]
    }));
    if (err) TE(err.message);
    return testResultList;

}

module.exports.getTestResult = async function (testId, studentId) {

    [err, test] = await to(TOA_test.findOne({

        where: { test_id: testId, status: 0, delete: 0 },
        order: [['test_id', 'DESC']],
        attributes: [['test_id', 'id'], ['test_title', 'title'], ['test_description', 'description'], ['test_type', 'isPaid'], 'paymentgateway_id', ['test_amount', 'amount'], ['test_preview', 'preview'], ['test_timed', 'timedTest'], ['test_duration', 'duration'], ['test_total_mark', 'totalMarks']],
        include: [
            {
                model: TOA_test_result,
                as: 'testResult',
                where: { student_id: studentId },
                attributes: ['correctAnswers', 'totalMarks', 'takenTime', 'totalQuestions', 'attempted', ['createdAt', 'appeared']],
                include: [
                    {
                        model: TOA_student,
                        as: 'student',
                        attributes: ['id', 'first_name', 'last_name', 'image'],


                    }
                ]
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
// ---------------------------------------------- Test Result ----------------------------------------------

// Test question Count
module.exports.testQuestionCount = async function (accountId) {

    [err, practiceQuestionCount] = await to(TOA_practice_question.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, assignmentsQuestionCount] = await to(TOA_test_question.count({ where: { status: 0, delete: 0, account_id: accountId } }));

    [err, bundleQuestionCount] = await to(TOA_testbundle_question.count({ where: { status: 0, delete: 0, accountId: accountId } }));

    return { practiceQuestionCount: practiceQuestionCount, assignmentsQuestionCount: assignmentsQuestionCount, bundleQuestionCount: bundleQuestionCount };
}