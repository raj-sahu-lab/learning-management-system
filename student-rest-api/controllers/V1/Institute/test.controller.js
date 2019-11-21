const testService = require('../../../services/V1/Institute/test.service');
const coursesService = require('../../../services/V1/Institute/courses.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');
const fs = require('fs');

// ---------------------------------------------- Set ---------------------------------------------- 

//Create new SET
const createSet = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please SET enter title.', 422);

    } else if (!body.instruction) {

        return ReE(res, 'Please enter SET instruction.', 422);

    } else {

        let set_json = {

            account_id: req.user.account_id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            set_title: body.title,
            set_instruction: body.instruction,
            create_ip: req.ip,
        };

        [err, set] = await to(testService.createSet(set_json));
        if (err) return ReE(res, err, 422);

        if (set) {

            [err, setObj] = await to(testService.getSet(req.user.account_id, set.set_id));

            return ReS(res, 'Set added successfully.', setObj);

        } else {

            return ReE(res, 'Failed to create set, please try again.', 422);
        }
    }
}
module.exports.createSet = createSet;

//Update SET
const updateSet = async function (req, res) {

    const body = req.fields;

    if (!body.setId) {

        return ReE(res, 'SET id missing.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please SET enter title.', 422);

    } else if (!body.instruction) {

        return ReE(res, 'Please enter SET instruction.', 422);

    } else if (body.status == null) {

        return ReE(res, 'Please select SET status.', 422);

    } else {

        let set_json = {
            set_id: body.pdfId,
            account_id: req.user.account_id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            set_title: body.title,
            set_instruction: body.instruction,
            create_ip: req.ip,
            status: body.status
        };

        [err, set] = await to(testService.updateSet(body.setId, set_json));
        if (err) return ReE(res, err, 422);

        if (set.length == 1 && set[0] == 1) {

            [err, setObj] = await to(testService.getSet(req.user.account_id, body.setId));
            return ReS(res, 'SET updated successfully.', setObj);

        } else {

            return ReE(res, 'Failed to update SET, please try again.', 422);
        }
    }
}
module.exports.updateSet = updateSet;

// Get All SET List
const getSetList = async function (req, res) {

    [err, setList] = await to(testService.getSetList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (setList.length == 0) {

        return ReE(res, 'SET List Not Available', 204);

    } else {

        return ReS(res, 'All SET List Got Successfully.', setList);
    }
}
module.exports.getSetList = getSetList;

// Delete SET
const deleteSet = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'SET id missing.');

    } else {

        [err, isSuccess] = await to(testService.deleteSet(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'SET deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete set. please try again.');
        }
    }
}
module.exports.deleteSet = deleteSet;

// ---------------------------------------------- SET ---------------------------------------------- 

// ---------------------------------------------- Test ---------------------------------------------- 

// Add New Test
const addNewTest = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter Instruction Title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter Instruction detail.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter test amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter test preview text.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (body.timedTest == null) {

        return ReE(res, 'Please select type of test.', 422);

    } else if (body.timedTest == true && !body.testDuration) {

        return ReE(res, 'Please enter test duration.', 422);

    } else if (!body.totalMarks) {

        return ReE(res, 'Please enter total marks for test.', 422);

    } else if (body.questions == null) {

        return ReE(res, 'Please enter some questions.', 422);

    } else {


        var questionError = "";

        await Promise.all(body.questions.map(async (question) => {

            if (!question.type) {

                questionError = "Question type is not selected";

            } else if (!question.question) {

                questionError = "Question missing";

            } else if (question.type == 1 && (!question.answer1 || !question.answer2 || !question.answer3 || !question.answer4)) {

                questionError = "Invalid question type and answer";

            } else if (question.type == 1 && !question.rightanswer) {

                questionError = "Please select the correct answer";
            }

        }));


        if (questionError == "") {

            [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
            if (err) return ReE(res, err, 422);
            var subjectObj = subjectObj.toJSON();

            let test_json = {
                account_id: req.user.account_id,
                branch_id: subjectObj.tutor.branch.id,
                subject_id: body.subjectId,
                topic_id: body.topicId,
                content_id: body.contentId,
                test_title: body.title,
                test_description: body.description,
                test_timed: body.timedTest,
                test_duration: body.testDuration,
                test_total_mark: body.totalMarks,
                test_type: body.isPaid,
                paymentgateway_id: body.isPaid == false ? null : body.paymentGateWayId,
                iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
                test_amount: body.isPaid == false ? null : body.amount,
                test_preview: body.isPaid == false ? null : body.reviewText,
                create_ip: req.ip,
            };

            if (body.currencyId) {

                test_json.currencyId = body.currencyId;
            }
            [err, test] = await to(testService.addNewTest(test_json));
            if (err) return ReE(res, err, 422);

            const test_id = test.test_id;


            var arrAllQuestion = [];
            await Promise.all(body.questions.map(async (question) => {

                const question_json = {

                    account_id: req.user.account_id,
                    test_id: test_id,
                    test_question: question.question,
                    test_question_type: question.type,
                    test_question_answer1: question.answer1,
                    test_question_answer2: question.answer2,
                    test_question_answer3: question.answer3,
                    test_question_answer4: question.answer4,
                    test_question_answer: question.rightanswer,
                    test_question_time: question.question_time,
                    test_question_mark: question.question_mark,
                    test_question_explanation: question.explanation,
                    test_question_video: question.videoLink
                };

                arrAllQuestion.push(question_json)
            }));


            [err, questions] = await to(testService.addQuestions(arrAllQuestion));
            [err, testObj] = await to(testService.getTest(req.user.account_id, test_id));

            if (err) return ReE(res, err, 422);
            return ReS(res, 'Test added successfully.', testObj);
        } else {

            return ReE(res, questionError, 422);
        }
    }
}
module.exports.addNewTest = addNewTest;

// Get All Test List
const getTestList = async function (req, res) {

    [err, testList] = await to(testService.getAllTest(req.user));
    if (err) return ReE(res, err, 422);

    if (testList.length == 0) {

        return ReE(res, 'Test List Not Available', 204);

    } else {

        return ReS(res, 'All Test List Got Successfully.', testList);
    }
}
module.exports.getTestList = getTestList;

// Delete Test
const deleteTest = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Test id missing.');

    } else {

        [err, isSuccess] = await to(testService.deleteTest(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Test deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete test. please try again.');
        }
    }
}
module.exports.deleteTest = deleteTest;
// ---------------------------------------------- Test ---------------------------------------------- 





// ---------------------------------------------- Practice Question ---------------------------------------------- 

// Add New Practice
const addPracticeQuestion = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter set name.', 422);

    } else if (body.questions == null) {

        return ReE(res, 'Please enter some questions.', 422);

    } else {


        var questionError = "";

        await Promise.all(body.questions.map(async (question) => {

            if (!question.question) {

                questionError = "Missing Question";

            } else if (!question.rightanswer) {

                questionError = "Please select the correct answer";
            }

        }));

        if (questionError == "") {

            [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
            if (err) return ReE(res, err, 422);
            var subjectObj = subjectObj.toJSON();

            let practice_json = {

                account_id: req.user.account_id,
                branch_id: subjectObj.tutor.branch.id,
                subject_id: body.subjectId,
                topic_id: body.topicId,
                content_id: body.contentId,
                practice_title: body.title,
                create_ip: req.ip,
            };

            [err, practice] = await to(testService.addNewpractice(practice_json));
            if (err) return ReE(res, err, 422);

            const practice_id = practice.practice_id;

            var arrAllQuestion = [];
            await Promise.all(body.questions.map(async (question) => {

                const question_json = {

                    account_id: req.user.account_id,
                    practice_id: practice_id,
                    practice_question_question: question.question,
                    practice_question_answer: question.rightanswer
                };

                arrAllQuestion.push(question_json)
            }));


            [err, questions] = await to(testService.addPracticeQuestions(arrAllQuestion));
            [err, practiceObj] = await to(testService.getPractice(req.user.account_id, practice_id));

            if (err) return ReE(res, err, 422);
            return ReS(res, 'Practice added successfully.', practiceObj);
        } else {

            return ReE(res, questionError, 422);
        }
    }
}
module.exports.addPracticeQuestion = addPracticeQuestion;

// Get All Practice List
const getPracticeList = async function (req, res) {

    [err, practiceList] = await to(testService.getPracticeList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (practiceList.length == 0) {

        return ReE(res, 'Practice List Not Available', 204);

    } else {

        return ReS(res, 'All Practice List Got Successfully.', practiceList);
    }
}
module.exports.getPracticeList = getPracticeList;

// // Delete Practice
const deletePractice = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Practice id missing.');

    } else {

        [err, isSuccess] = await to(testService.deletePractice(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Practice deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete practice. please try again.');
        }
    }
}
module.exports.deletePractice = deletePractice;
// ---------------------------------------------- Practice Question ---------------------------------------------- 



// ---------------------------------------------- Test Result ---------------------------------------------- 

// Get list of all the result of the student
module.exports.getStudentTestResultList = async function (req, res) {

    [err, resultList] = await to(testService.getStudentTestResultList(req.user));
    if (err) return ReE(res, err, 422);

    if (resultList.length == 0) {

        return ReS(res, 'No test taken yet.', [], 204);

    } else {

        return ReS(res, 'Test list get successfully.', resultList);
    }

}

module.exports.getTestResult = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Test id missing.', 422);

    } else if (!req.params.studentId) {

        return ReE(res, 'Student id missing.', 422);

    } else {

        const testId = req.params.id;
        [err, testResult] = await to(testService.getTestResult(testId, req.params.studentId));
        if (err) return ReE(res, err, 422);

        var testResult = testResult.toJSON();
        testResult.testResult.student.image = await GetSignUrl(testResult.testResult.student.image);

        [err, testQuestionList] = await to(testService.getTestQuestionResultList(testId, req.params.studentId));
        if (err) return ReE(res, err, 422);


        const responseJSON = {
            testDetail: testResult,
            questionAnswers: testQuestionList
        };

        return ReS(res, 'Test result get successfully.', responseJSON);
    }
}
// ---------------------------------------------- Test Result ----------------------------------------------

// Test Question count
module.exports.testQuestionCount = async function (req, res) {

    const accountId = req.user.account_id;
    [err, counts] = await to(testService.testQuestionCount(accountId));
    return ReS(res, 'Questions Count got successfully.', counts);
}