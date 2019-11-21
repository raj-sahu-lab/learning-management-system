const testService = require('../../../services/V1/Student_Enterprise/Test.service');
const dashboardService = require('../../../services/V1/Student_Enterprise/Dashboard.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');

// Get All Test List
module.exports.getTestList = async function (req, res) {

    
    [err, defaultBranch] = await to(dashboardService.getDefaultBranch(req.user.id));
    if (err) return ReE(res, err, 422);
    
    if(!defaultBranch.defaultBranch){

        return ReE(res, 'Please set your default branch.',422);
    }
            
    [err, testList] = await to(testService.getTestList(defaultBranch.defaultBranch ,req.user.id));
    if (err) return ReE(res, err, 422);

    if (testList.length == 0) {
 
        return ReE(res, 'Test List Not Available', 204);

    } else {

        var testListSinged = []

        await Promise.all(testList.map(async (test) => {

            var testJson = test.toJSON();
            if(testJson.testResult == null){
                [err, purchase] = await to(dashboardService.checkPurchase(4,testJson.id, req.user.id));        
                if(purchase){
    
                    let purchaseJSON = purchase.toJSON();
                    purchaseJSON.remainDays = purchaseJSON.dayLimit - purchaseJSON.remainDays;
                    testJson.purchase = purchaseJSON;
    
                } else {
    
                    testJson.purchase = null;
                }
                
    
                testListSinged.push(testJson)
            }
        }));

        return ReS(res, 'All Test List Got Successfully.', testListSinged);
    }
}



// Get All Test Question List
module.exports.getTestQuestionList = async function (req, res) {

    const testId = req.params.id;

    [err, testQuestionList] = await to(testService.getTestQuestionList(testId));
    if (err) return ReE(res, err, 422);

    if (testQuestionList.length == 0) {

        return ReE(res, 'Test Question List Not Available', 204);

    } else {

        return ReS(res, 'All Test Question List Got Successfully.', testQuestionList);
    }
}

// Save the result of the taken test
module.exports.storeTestQuestionResult = async function (req, res) {

    const body = req.fields;

    if (!body.testId) {

        return ReE(res, 'Test id missing.', 422);

    } else if (!body.answers) {

        return ReE(res, 'Question answers are not submitted.', 422);

    } else {

        var answerError = "";

        await Promise.all(body.answers.map(async (answer) => {

            if (!answer.questionId) {

                answerError = "Question type is not selected";

            } else if (!answer.answer) {

                answerError = "Question missing";

            }
        }));

        if (answerError == "") {

            [err, testQuestionList] = await to(testService.getTestQuestionList(body.testId));
            if (err) return ReE(res, err, 422);

            var arrAllAnswers = [];

            var correctAnswers = 0;
            var totalMarks = 0;
            var takenTime = 0;

            await Promise.all(body.answers.map(async (answer) => {

                await Promise.all(testQuestionList.map(async (question) => {

                    if (answer.questionId == question.toJSON().id && answer.answer == question.toJSON().answer) {

                        correctAnswers = correctAnswers + 1;
                        totalMarks = totalMarks + question.toJSON().mark;
                    }
                }));

                if (answer.takenTime) {

                    takenTime = takenTime + answer.takenTime;
                }
                const answer_json = {
                    student_id: req.user.id,
                    test_question_id: answer.questionId,
                    test_answer: answer.answer,
                    test_question_taken_time: answer.takenTime,
                    create_ip: req.ip
                };

                arrAllAnswers.push(answer_json)
            }));

            [err, testAnswerList] = await to(testService.addQuestionsAnswers(arrAllAnswers));
            if (err) return ReE(res, err, 422);

            const result = {

                test_id: body.testId,
                student_id: req.user.id,
                correctAnswers: correctAnswers,
                totalMarks: totalMarks,
                takenTime: takenTime,
                totalQuestions: testQuestionList.length,
                attempted: arrAllAnswers.length,
                create_ip: req.ip
            };

            [err, testResult] = await to(testService.addTestResult(result));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'Test Question Answered Stored Successfully.');

        } else {

            return ReE(res, answerError, 422);
        }
    }
}

// Get list of all the result for the student
module.exports.getTestResultList = async function (req, res) {

    [err, resultList] = await to(testService.getTestResultList(req.user.id));
    if (err) return ReE(res, err, 422);

    if (resultList.length == 0) {

        return ReS(res, 'No test taken yet.', [], 204);

    } else {

        return ReS(res, 'Test list get successfully.', resultList);
    }

}

// Get particular test result 
module.exports.getRestResult = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Test id missing.', 422);

    } else {

        const testId = req.params.id;
        [err, testResult] = await to(testService.getTestResult(testId, req.user.id));
        if (err) return ReE(res, err, 422);

        [err, testQuestionList] = await to(testService.getTestQuestionResultList(testId, req.user.id));
        if (err) return ReE(res, err, 422);

        // var arrAnswersResult = [];
        // await Promise.all(testQuestionList.map(async (question) => {

        //     await Promise.all(body.answers.map(async (answer) => {

        //         if (answer.questionId == question.toJSON().id) {


        //         }

        //     }));
        // }));

        const responseJSON = {
            testDetail: testResult,
            questionAnswers: testQuestionList
        };

        return ReS(res, 'Test result get successfully.', responseJSON);
    }
}

// Get All Practice Question List
module.exports.getPracticeQuestionList = async function (req, res) {

    const practiceId = req.params.id;

    [err, testQuestionList] = await to(testService.getPracticeQuestionList(practiceId));
    if (err) return ReE(res, err, 422);

    if (testQuestionList.length == 0) {

        return ReE(res, 'Practice Question List Not Available', 204);

    } else {

        return ReS(res, 'All Practice Test Question List Got Successfully.', testQuestionList);
    }
}
