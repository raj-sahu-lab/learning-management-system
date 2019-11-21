const testBundleService = require('../../../services/V1/Student/TestBundle.service');
const dashboardService = require('../../../services/V1/Student/Dashboard.service');
const { to, ReE, ReS, UploadImage, GetSignUrl } = require('../../../services/V1/util.service');
const fs = require('fs');
const pluck = require('arr-pluck');

// Bundle
module.exports.getBundleList = async function (req, res) {

    const accountId = req.user.branch.account.toJSON().id;

    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    [err, bundleList] = await to(testBundleService.getBundleList(accountId, pageNo, pageLimit, req.user.id));
    if (err) return ReE(res, err, 422);

    if (bundleList.length == 0) {

        return ReE(res, 'Bundle list is empty.', 204);

    } else {

        var signedQuestionList = [];

        for (let index = 0; index < bundleList.length; index++) {

            var bundle = bundleList[index];
            var bundleJSON = bundle.toJSON();

            [err, purchase] = await to(dashboardService.checkPurchase(10, bundleJSON.id, req.user.id));
            if (purchase) {

                let purchaseJSON = purchase.toJSON();

                let purchaseDate = new Date(purchaseJSON.purchaseDate);
                purchaseDate.setTime(purchaseDate.getTime() + purchaseJSON.dayLimit * 86400000);
                const currentDate = new Date();

                if (purchaseDate > currentDate) {

                    const miliSecound = purchaseDate.getTime() - currentDate.getTime()
                    var remainHours = (miliSecound / (1000 * 60 * 60)).toFixed(2);
                    purchaseJSON.remainHours = parseFloat(remainHours);
                    purchaseJSON.remainDays = purchaseJSON.dayLimit - purchaseJSON.remainDays;
                    bundleJSON.purchase = purchaseJSON;

                } else {

                    bundleJSON.purchase = null;
                }
            } else {

                bundleJSON.purchase = null;
            }

            signedQuestionList.push(bundleJSON);

        }
        return ReS(res, 'All Bundle List Got Successfully.', signedQuestionList);
    }
}

// Set
module.exports.getBundleSetList = async function (req, res) {

    const accountId = req.user.branch.account.toJSON().id;

    const bundleId = parseInt(req.params.bundleId);
    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    [err, setSeriesList] = await to(testBundleService.getBundleSetList(accountId, pageNo, pageLimit, bundleId));
    if (err) return ReE(res, err, 422);

    if (setSeriesList.length == 0) {

        return ReE(res, 'Bundle series list is empty.', 204);

    } else {

        var calculatedList = [];

        for (let index = 0; index < setSeriesList.length; index++) {

            let element = setSeriesList[index].toJSON();

            element.set.seriesCount = element.set.seriesList.length;
            delete element.set.seriesList;

            calculatedList.push(element);

        }
        return ReS(res, 'All Set List Got Successfully.', calculatedList);
    }
}

// Series
module.exports.getBundleSeriesList = async function (req, res) {

    const accountId = req.user.branch.account.toJSON().id;
    const studentId = req.user.id;
    const setId = parseInt(req.params.setId);
    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);


    [err, setSeriesList] = await to(testBundleService.getBundleSeriesList(accountId, pageNo, pageLimit, setId, studentId));
    if (err) return ReE(res, err, 422);

    if (setSeriesList.length == 0) {

        return ReE(res, 'Bundle series list is empty.', 204);

    } else {

        var calculatedList = [];
        for (let index = 0; index < setSeriesList.length; index++) {

            var element = setSeriesList[index].toJSON();

            var totalMarks = 0;
            var totalTime = 0;

            for (let indexIn = 0; indexIn < element.series.questionList.length; indexIn++) {

                const question = element.series.questionList[indexIn];
                totalMarks += question.question.mark;
                totalTime += question.question.duration;

            }
            element.series.questionCount = element.series.questionList.length;
            element.series.noEqualTotalMarks = totalMarks;
            element.series.noEqualTotalTime = totalTime;
            delete element.series.questionList;
            calculatedList.push(element);

        }
        return ReS(res, 'All series List Got Successfully.', calculatedList);
    }
}


// Question
module.exports.getBundleQuestionList = async function (req, res) {

    const accountId = req.user.branch.account.toJSON().id;

    const seriesId = parseInt(req.params.seriesId);
    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    [err, questionList] = await to(testBundleService.getBundleQuestionList(accountId, pageNo, pageLimit, seriesId));
    if (err) return ReE(res, err, 422);

    if (questionList.length == 0) {

        return ReE(res, 'Bundle question list is empty.', 204);

    } else {

        var signedQuestionList = [];

        for (let index = 0; index < questionList.length; index++) {

            var bundleQuestion = questionList[index];

            var bundleQuestionJSON = bundleQuestion.toJSON().question;

            if (bundleQuestionJSON.questionMedia) {

                bundleQuestionJSON.questionMedia = await GetSignUrl(bundleQuestionJSON.questionMedia);
            }

            var answerListSigned = [];

            await Promise.all(bundleQuestionJSON.options.map(async (answer) => {

                let answerJSON = answer;
                if (answerJSON.optionMedia) {
                    answerJSON.optionMedia = await GetSignUrl(answerJSON.optionMedia);
                }
                answerListSigned.push(answerJSON);


            }));

            signedQuestionList.push(bundleQuestionJSON);
        }

        return ReS(res, 'All Question List Got Successfully.', signedQuestionList);
    }
}


// Save the result of the taken test bundle series
module.exports.saveTestBundleSeriesResult = async function (req, res) {

    const body = req.fields;

    if (body.bundleId == null) {

        return ReE(res, 'Please select bundle.', 422);

    } else if (body.setId == null) {

        return ReE(res, 'Please select set.', 422);

    } else if (body.seriesId == null) {

        return ReE(res, 'please select series.', 422);

    } else if (!body.answers) {

        return ReE(res, 'Question answers are not submitted.', 422);

    } else {

        var answerError = "";

        await Promise.all(body.answers.map(async (answer) => {

            if (answer.questionId == null) {

                answerError = "Question type is not selected";

            } else if (answer.questionAnswerId == null) {

                answerError = "Question missing";

            }
        }));

        if (answerError == "") {

            const accountId = req.user.branch.account.toJSON().id;

            [err, series] = await to(testBundleService.getBundleSeries(body.seriesId));
            if (err) return ReE(res, err, 422);
            if (series == null) {

                return ReE(res, 'Series not found.', 422);
            }

            const seriesJSON = series.toJSON();

            [err, questionList] = await to(testBundleService.getSeriesQuestionList(accountId, body.seriesId));
            if (err) return ReE(res, err, 422);

            const eachQustionMark = seriesJSON.totalMarks / questionList.length;

            var arrAllAnswers = [];

            var correctAnswers = 0;
            var totalMarks = 0;
            var takenTime = 0;

            var result = {

                accountId: accountId,
                studentId: req.user.id,
                bundleId: body.bundleId,
                setId: body.setId,
                seriesId: body.seriesId,
                correctAnswers: correctAnswers,
                totalMarks: totalMarks,
                takenTime: takenTime,
                totalQuestions: questionList.length,
                attempted: body.answers.length,
                create_ip: req.ip
            };

            [err, seriesResult] = await to(testBundleService.addSeriesResult(result));
            if (err) return ReE(res, err, 422);

            for (let index = 0; index < body.answers.length; index++) {

                const answer = body.answers[index];

                if (answer.takenTime) {

                    takenTime = takenTime + answer.takenTime;
                }

                var answerJson = {

                    studentId: req.user.id,
                    questionId: answer.questionId,
                    studentResultId: seriesResult.toJSON().id,
                    questionAnswerId: answer.questionAnswerId,
                    takenTime: answer.takenTime,
                    create_ip: req.ip
                };

                var isAdded = false;

                for (let indexIn = 0; indexIn < questionList.length; indexIn++) {

                    let questionJSON = questionList[indexIn].toJSON();

                    if (answer.questionId == questionJSON.question.id) {

                        if (questionJSON.question.options.length == 1 && /^-{0,1}\d+$/.test(answer.questionAnswerId)) {

                            if (answer.questionAnswerId == questionJSON.question.options[0].id) {

                                correctAnswers = correctAnswers + 1;
                                if (seriesJSON.markEqual) {

                                    totalMarks = totalMarks + eachQustionMark;

                                } else {

                                    totalMarks = totalMarks + questionJSON.question.mark;
                                }

                            }

                        } else {

                            let optionIds = pluck(questionJSON.question.options, 'id');
                            let answerIds = answer.questionAnswerId.split(",");

                            isAdded = true;

                            let answerList = answerIds.filter(value => optionIds.includes(parseInt(value)));

                            if (answerList.length > 0) {

                                correctAnswers = correctAnswers + 1;
                                if (seriesJSON.markEqual) {

                                    totalMarks = totalMarks + eachQustionMark;

                                } else {

                                    totalMarks = totalMarks + questionJSON.question.mark;

                                }
                            }

                            for (let indexanswerIds = 0; indexanswerIds < answerIds.length; indexanswerIds++) {


                                const answerId = answerIds[indexanswerIds];
                                var answerJsonSub = {

                                    studentId: req.user.id,
                                    questionId: answer.questionId,
                                    studentResultId: seriesResult.toJSON().id,
                                    questionAnswerId: parseInt(answerId),
                                    takenTime: answer.takenTime,
                                    create_ip: req.ip
                                }

                                arrAllAnswers.push(answerJsonSub)

                            }
                        }
                    }
                }

                if (isAdded == false) {

                    arrAllAnswers.push(answerJson)
                }

            }

            [err, answerList] = await to(testBundleService.addBundleSeriesAnswer(arrAllAnswers));
            if (err) return ReE(res, err, 422);

            result = {
                correctAnswers: correctAnswers,
                totalMarks: totalMarks,
                takenTime: takenTime,
                totalQuestions: questionList.length,
            };

            [err, result] = await to(testBundleService.updateSeriesResult(seriesResult.toJSON().id, result));
            if (err) return ReE(res, err, 422);


            return ReS(res, 'Test Bundle Result Stored Successfully.', { id: seriesResult.toJSON().id });

        } else {

            return ReE(res, answerError, 422);
        }
    }
}


// Get Single Result Detail
module.exports.getBundleResultList = async function (req, res) {

    const accountId = req.user.branch.account.toJSON().id;
    const studentId = req.user.id;
    const resultId = req.params.id;
    if (resultId != null) {

        [err, result] = await to(testBundleService.getBundleResult(accountId, studentId, resultId));
        if (err) return ReE(res, err, 422);

        if (result != null) {


            var result = result.toJSON();


            for (let indexIn = 0; indexIn < result.series.questionList.length; indexIn++) {

                if (result.series.questionList[indexIn].question.questionMedia != null) {

                    result.series.questionList[indexIn].question.questionMedia = await GetSignUrl(result.series.questionList[indexIn].question.questionMedia);
                }

                for (let indexInner = 0; indexInner < result.series.questionList[indexIn].question.options.length; indexInner++) {

                    if (result.series.questionList[indexIn].question.options[indexInner].optionMedia != null) {

                        result.series.questionList[indexIn].question.options[indexInner].optionMedia = await GetSignUrl(result.series.questionList[indexIn].question.options[indexInner].optionMedia);
                    }

                }
            }

            return ReS(res, 'Result got successfully.', result);

        } else {

            return ReE(res, 'Result not found', 422);

        }

    } else {

        [err, resultList] = await to(testBundleService.getBundleResultList(accountId, studentId));
        if (err) return ReE(res, err, 422);

        if (resultList.length > 0) {

            var singedResultList = [];
            for (let index = 0; index < resultList.length; index++) {

                var result = resultList[index].toJSON();

                for (let indexIn = 0; indexIn < result.series.questionList.length; indexIn++) {

                    if (result.series.questionList[indexIn].question.questionMedia != null) {

                        result.series.questionList[indexIn].question.questionMedia = await GetSignUrl(result.series.questionList[indexIn].question.questionMedia);
                    }

                    for (let indexInner = 0; indexInner < result.series.questionList[indexIn].question.options.length; indexInner++) {

                        if (result.series.questionList[indexIn].question.options[indexInner].optionMedia != null) {

                            result.series.questionList[indexIn].question.options[indexInner].optionMedia = await GetSignUrl(result.series.questionList[indexIn].question.options[indexInner].optionMedia);
                        }
                    }

                }

                singedResultList.push(result);

            }

            return ReS(res, 'Result list got successfully.', singedResultList);

        } else {

            return ReE(res, 'No Test taken yet.', 204);
        }
    }
}