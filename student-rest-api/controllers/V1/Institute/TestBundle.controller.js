const testBundleService = require('../../../services/V1/Institute/TestBundle.service');
const { to, ReE, ReS, UploadImage, GetSignUrl } = require('../../../services/V1/util.service');
const fs = require('fs');


// Test Bundle Cound 
module.exports.bundleCounts = async function (req, res) {

    const accountId = req.user.account_id;
    [err, counts] = await to(testBundleService.bundleCounts(accountId));

    return ReS(res, 'Counts get successfully.', counts);
}

// Question
module.exports.addBundleQuestion = async function (req, res) {

    const body = req.fields;
    const accountId = req.user.account_id;
    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (body.question == null && req.files.questionMedia == null) {

        return ReE(res, 'Please enter question.', 422);

    } else if (body.questionType == null) {

        return ReE(res, 'Please question type.', 422);

    } else if (body.questionOptions && JSON.parse(body.questionOptions).length == 0) {

        return ReE(res, 'Please enter question options.', 422);

    } else if (body.mark == null) {

        return ReE(res, 'Please enter mark.', 422);

    } else if (body.duration == null) {

        return ReE(res, 'Please enter question time duration.', 422);

    } else {

        var questionJSON = {
            accountId: accountId,
            subjectId: body.subjectId,
            question: body.question,
            question_type: body.questionType,
            mark: body.mark,
            duration: body.duration,
            create_ip: req.ip
        };

        if (req.files.questionMedia && req.files.questionMedia.name) {

            var imageBuffer = fs.readFileSync(req.files.questionMedia.path);
            var name = (new Date().getTime().toString()) + '_' + req.files.questionMedia.name;
            [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
            if (err) return ReE(res, err, 422);
            questionJSON.questionMedia = s3Bucket.Key;
        }

        [err, quesiton] = await to(testBundleService.addBundleQuestion(questionJSON));
        if (err) return ReE(res, 'Failed to add question. please try again', 422);

        if (quesiton) {

            if (body.questionOptions.length > 0) {

                var options = [];


                var answerMedia1 = null;
                if (req.files.answerMedia1 != null && req.files.answerMedia1.name) {

                    var imageBuffer = fs.readFileSync(req.files.answerMedia1.path);
                    var name = (new Date().getTime().toString()) + '_' + req.files.answerMedia1.name;
                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);
                    answerMedia1 = s3Bucket.Key;
                }

                var answerMedia2 = null;
                if (req.files.answerMedia2 != null && req.files.answerMedia2.name) {

                    var imageBuffer = fs.readFileSync(req.files.answerMedia2.path);
                    var name = (new Date().getTime().toString()) + '_' + req.files.answerMedia2.name;
                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);
                    answerMedia2 = s3Bucket.Key;
                }

                var answerMedia3 = null;
                if (req.files.answerMedia3 != null && req.files.answerMedia3.name) {

                    var imageBuffer = fs.readFileSync(req.files.answerMedia3.path);
                    var name = (new Date().getTime().toString()) + '_' + req.files.answerMedia3.name;
                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);
                    answerMedia3 = s3Bucket.Key;
                }

                var answerMedia4 = null;
                if (req.files.answerMedia4 != null && req.files.answerMedia4.name) {

                    var imageBuffer = fs.readFileSync(req.files.answerMedia4.path);
                    var name = (new Date().getTime().toString()) + '_' + req.files.answerMedia4.name;
                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);
                    answerMedia4 = s3Bucket.Key;
                }

                var answerMedia5 = null;
                if (req.files.answerMedia5 != null && req.files.answerMedia5.name) {

                    var imageBuffer = fs.readFileSync(req.files.answerMedia5.path);
                    var name = (new Date().getTime().toString()) + '_' + req.files.answerMedia5.name;
                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);
                    answerMedia5 = s3Bucket.Key;
                }

                var answerList = JSON.parse(body.questionOptions);

                await Promise.all(answerList.map(async (option) => {


                    if (option.id == 1) {

                        options.push({ questionId: quesiton.id, option: option.answer, isAnswer: option.isAnswer, optionMedia: answerMedia1 });

                    } else if (option.id == 2) {

                        options.push({ questionId: quesiton.id, option: option.answer, isAnswer: option.isAnswer, optionMedia: answerMedia2 });

                    } else if (option.id == 3) {

                        options.push({ questionId: quesiton.id, option: option.answer, isAnswer: option.isAnswer, optionMedia: answerMedia3 });

                    } else if (option.id == 4) {

                        options.push({ questionId: quesiton.id, option: option.answer, isAnswer: option.isAnswer, optionMedia: answerMedia4 });

                    } else {

                        options.push({ questionId: quesiton.id, option: option.answer, isAnswer: option.isAnswer, optionMedia: answerMedia5 });
                    }

                }));

                [err, options] = await to(testBundleService.addBundleQuestionOptions(options));
                if (err) return ReE(res, err, 422);

            }

            [err, bundleQuestion] = await to(testBundleService.getBundleQuestion(quesiton.id));
            if (err) return ReE(res, err, 422);
            if (bundleQuestion) {

                var bundleQuestionJSON = bundleQuestion.toJSON();

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
                bundleQuestionJSON.options = answerListSigned;

                return ReS(res, 'Bundle question added successfully.', bundleQuestionJSON);
            } else {

            }


        } else {
            return ReE(res, 'Failed to add question. please try again', 422);
        }
    }
}

module.exports.getBundleQuestionList = async function (req, res) {

    const accountId = req.user.account_id;

    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);
    const questionType = req.params.type;


    [err, bundleQuestionList] = await to(testBundleService.getBundleQuestionList(accountId, pageNo, pageLimit, questionType));
    if (err) return ReE(res, err, 422);

    if (bundleQuestionList.length == 0) {

        return ReE(res, 'Bundle list is empty.', 204);

    } else {

        var signedQuestionList = [];

        for (let index = 0; index < bundleQuestionList.length; index++) {

            var bundleQuestion = bundleQuestionList[index];

            var bundleQuestionJSON = bundleQuestion.toJSON();

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

        return ReS(res, 'All bundle question List Got Successfully.', signedQuestionList);
    }
}

module.exports.deleteBundleQuestion = async function (req, res) {

    const questionId = req.params.id;
    const updateJSON = { delete: 1 };

    [err, isSuccess] = await to(testBundleService.updateBundleQuestion(questionId, updateJSON));
    if (err) return ReE(res, err, 422);
    if (isSuccess.length == 1 && isSuccess[0] == 1) {

        return ReS(res, 'Question Deleted successfully.');

    } else {

        return ReE(res, 'Failed to delete question. please try again.');
    }
}

module.exports.getQuestionListBySelectedTypes = async function (req, res) {

    const accountId = req.user.account_id;
    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    const body = req.fields;

    if(body.types == null){

        return ReE(res, 'Please select questions types.', 422);

    } else if (body.types.length == 0) {

        return ReE(res, 'Please select questions types.', 422);
        
    } else {

        [err, bundleQuestionList] = await to(testBundleService.getBundleQuestionListByTypes(accountId, pageNo, pageLimit, body.types));
        if (err) return ReE(res, err, 422);

        if (bundleQuestionList.length == 0) {

            return ReE(res, 'Bundle list is empty.', 204);

        } else {

            var signedQuestionList = [];

            for (let index = 0; index < bundleQuestionList.length; index++) {

                var bundleQuestion = bundleQuestionList[index];

                var bundleQuestionJSON = bundleQuestion.toJSON();

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

            return ReS(res, 'All bundle question List Got Successfully.', signedQuestionList);
        }

    }
}

// Series
module.exports.createBundleQuestionSeries = async function (req, res) {

    const accountId = req.user.account_id;
    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.preview) {

        return ReE(res, 'Please enter preview.', 422);

    } else if (!body.selectedQuestions || body.selectedQuestions.length == 0) {

        return ReE(res, 'Please select questions.', 422);

    } else if (body.timed == null) {

        return ReE(res, 'Please select series is timed or not.', 422);

    } else if (body.timed == 1 && body.timeEqual == null) {

        return ReE(res, 'Please select all series time is equal or not.', 422);

    } else if (body.timed == 1 && body.timeEqual == 1 && body.duration == null) {

        return ReE(res, 'Please enter total time.', 422);

    } else if (body.marked == null) {

        return ReE(res, 'Please select series have marks or not.', 422);

    } else if (body.marked == 1 && body.markEqual == null) {

        return ReE(res, 'Please select all series marks is equal or not.', 422);

    } else if (body.marked == 1 && body.markEqual == 1 && body.totalMarks == null) {

        return ReE(res, 'Please enter total marks.', 422);

    } else {

        var seriesJSON = {

            accountId: accountId,
            title: body.title,
            preview: body.preview,
            timed: body.timed,
            timeEqual: body.timeEqual,
            duration: body.duration,
            marked: body.marked,
            markEqual: body.markEqual,
            totalMarks: body.totalMarks,
            create_ip: req.ip
        };

        [err, series] = await to(testBundleService.addBundleQuestionSeries(seriesJSON));
        if (err) return ReE(res, err, 422);
        if (err) return ReE(res, 'Failed to create test series, please try again.', 422);
        if (series) {

            seriesJSON = series.toJSON();

            var questionIdList = []
            body.selectedQuestions.forEach(questionId => {

                questionIdList.push({ testSeriesId: seriesJSON.id, questionId: questionId, create_ip: req.ip });

            });

            [err, quesitonList] = await to(testBundleService.addBundleQuestionSeriesQuestions(questionIdList));
            if (err) return ReE(res, 'Failed to create test series, please try again. 2', 422);
            if (quesitonList) {

                [err, bundleSeries] = await to(testBundleService.getBundleSeries(accountId, seriesJSON.id));
                if (err) return ReE(res, err, 422);
                if (bundleSeries) {

                    var bundleSeriesJSON = bundleSeries.toJSON();

                    var questionListSigned = [];

                    await Promise.all(bundleSeriesJSON.questionList.map(async (question) => {

                        let questionJSON = question;
                        if (questionJSON.question.questionMedia) {
                            questionJSON.question.questionMedia = await GetSignUrl(questionJSON.question.questionMedia);
                        }
                        questionListSigned.push(questionJSON);

                    }));

                    bundleSeriesJSON.questionList = questionListSigned
                    return ReS(res, 'Series created successfully.', bundleSeriesJSON);

                } else {

                    return ReS(res, 'Series created successfully.');
                }

            } else {

                return ReS(res, 'Series created successfully.');
            }


        } else {

            return ReE(res, 'Failed to create test series, please try again.', 422);
        }
    }
}

module.exports.getBundleSeriesList = async function (req, res) {

    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    const accountId = req.user.account_id;

    [err, bundleSeriesList] = await to(testBundleService.getBundleSeriesList(accountId, pageNo, pageLimit));
    if (err) return ReE(res, err, 422);

    if (bundleSeriesList.length == 0) {

        return ReE(res, 'Bundle series list is empty.', 204);

    } else {

        var signedSeriesList = [];

        for (let index = 0; index < bundleSeriesList.length; index++) {

            var bundleSeries = bundleSeriesList[index];

            var bundleSeriesJSON = bundleSeries.toJSON();

            var questionListSigned = [];

            await Promise.all(bundleSeriesJSON.questionList.map(async (question) => {

                let questionJSON = question;
                if (questionJSON.question && questionJSON.question.questionMedia) {
                    questionJSON.question.questionMedia = await GetSignUrl(questionJSON.question.questionMedia);
                }
                questionListSigned.push(questionJSON);

            }));

            bundleSeriesJSON.questionList = questionListSigned

            signedSeriesList.push(bundleSeriesJSON);
        }

        return ReS(res, 'All bundle series List Got Successfully.', signedSeriesList);
    }
}

module.exports.deleteBundleSeries = async function (req, res) {

    const seriesId = req.params.id;
    const updateJSON = { delete: 1 };

    [err, isSuccess] = await to(testBundleService.updateBundleSeries(seriesId, updateJSON));
    if (err) return ReE(res, err, 422);
    if (isSuccess.length == 1 && isSuccess[0] == 1) {

        return ReS(res, 'Series Deleted successfully.');

    } else {

        return ReE(res, 'Failed to delete series. please try again.');
    }
}

module.exports.addQuestionsToSeries = async function (req, res) {

    const accountId = req.user.account_id;
    const body = req.fields;

    if (!body.seriesId) {

        return ReE(res, 'Please select series.', 422);

    } else if (!body.selectedQuestions || body.selectedQuestions.length == 0) {

        return ReE(res, 'Please select questions.', 422);

    } else {

        const seriesId = body.seriesId;
        var questionIdList = []

        await Promise.all(body.selectedQuestions.map(async (questionId) => {

            [err, questionResult] = await to(testBundleService.getSeriesQuestion(seriesId, questionId));
            if (questionResult == null) {

                questionIdList.push({ testSeriesId: seriesId, questionId: questionId, create_ip: req.ip });
            }

        }));


        [err, quesitonList] = await to(testBundleService.addBundleQuestionSeriesQuestions(questionIdList));
        if (err) return ReE(res, 'Failed to add  questions', 422);
        if (quesitonList) {

            [err, bundleSeries] = await to(testBundleService.getBundleSeries(accountId, seriesId));
            if (err) return ReE(res, err, 422);
            if (bundleSeries) {

                var bundleSeriesJSON = bundleSeries.toJSON();

                var questionListSigned = [];

                await Promise.all(bundleSeriesJSON.questionList.map(async (question) => {

                    let questionJSON = question;
                    if (questionJSON.question.questionMedia) {
                        questionJSON.question.questionMedia = await GetSignUrl(questionJSON.question.questionMedia);
                    }
                    questionListSigned.push(questionJSON);

                }));

                bundleSeriesJSON.questionList = questionListSigned
                return ReS(res, 'Question added successfully.', bundleSeriesJSON);

            } else {

                return ReS(res, 'Question added successfully.');
            }

        } else {

            return ReS(res, 'Question added successfully.');
        }
    }
}

module.exports.deleteBundleSeriesQuestion = async function (req, res) {

    const seriesQuestionId = req.params.id;

    [err, isSuccess] = await to(testBundleService.deleteBundleSeriesQuestion(seriesQuestionId));
    if (err) return ReE(res, err, 422);
    if (isSuccess == 1) {

        return ReS(res, 'Question remmoved  successfully.');

    } else {

        return ReE(res, 'Failed to remove question, please try again.');
    }
}

// Set
module.exports.createBundleSeriesSet = async function (req, res) {

    const accountId = req.user.account_id;
    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.selectedSeries || body.selectedSeries.length == 0) {

        return ReE(res, 'Please select series.', 422);

    } else {

        var setJSON = {

            accountId: accountId,
            title: body.title,
            create_ip: req.ip
        };

        [err, creatdSet] = await to(testBundleService.addSeriesSet(setJSON));
        if (err) return ReE(res, 'Failed to create set, please try again.', 422);
        if (creatdSet) {

            var creatdSetJSON = creatdSet.toJSON();

            var setSeriesList = []
            body.selectedSeries.forEach(seriesId => {

                setSeriesList.push({ setId: creatdSetJSON.id, seriesId: seriesId, create_ip: req.ip });

            });

            [err, seriesSetList] = await to(testBundleService.addSeriesInToSet(setSeriesList));
            if (err) return ReE(res, 'Failed to create set, please try again.', 422);

            if (seriesSetList) {

                [err, seriesSet] = await to(testBundleService.getSeriesSet(accountId, creatdSetJSON.id));
                if (err) return ReE(res, err, 422);
                return ReS(res, 'Set created successfully.', seriesSet);

            } else {

                return ReS(res, 'Set created successfully.');
            }
        } else {

            return ReE(res, 'Failed to create set, please try again.', 422);
        }
    }
}

module.exports.getSetSeriesList = async function (req, res) {

    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    const accountId = req.user.account_id;

    [err, setSeriesList] = await to(testBundleService.getSetSeriesList(accountId, pageNo, pageLimit));
    if (err) return ReE(res, err, 422);

    if (setSeriesList.length == 0) {

        return ReE(res, 'Bundle series list is empty.', 204);

    } else {

        return ReS(res, 'All Set List Got Successfully.', setSeriesList);
    }
}

module.exports.deleteSet = async function (req, res) {

    const setId = req.params.id;
    const updateJSON = { delete: 1 };

    [err, isSuccess] = await to(testBundleService.updateSet(setId, updateJSON));
    if (err) return ReE(res, err, 422);
    if (isSuccess.length == 1 && isSuccess[0] == 1) {

        return ReS(res, 'Set Deleted successfully.');

    } else {

        return ReE(res, 'Failed to delete set. please try again.');
    }
}

module.exports.addSeriesToSet = async function (req, res) {

    const accountId = req.user.account_id;
    const body = req.fields;

    if (!body.setId) {

        return ReE(res, 'Please select set.', 422);

    } else if (!body.selectedSeries || body.selectedSeries.length == 0) {

        return ReE(res, 'Please select series.', 422);

    } else {

        const setId = body.setId;
        var seriesIdList = []

        await Promise.all(body.selectedSeries.map(async (seriesId) => {

            [err, seriesResult] = await to(testBundleService.getSetSeries(setId, seriesId));
            if (seriesResult == null) {

                seriesIdList.push({ setId: setId, seriesId: seriesId, create_ip: req.ip });
            }
        }));


        [err, setSeriesList] = await to(testBundleService.addSeriesInToSet(seriesIdList));
        if (err) return ReE(res, err, 422);
        if (setSeriesList) {

            [err, seriesSet] = await to(testBundleService.getSeriesSet(accountId, setId));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Series added successfully.', seriesSet);

        } else {

            return ReE(res, 'Failed to add series. please try again.', 422);
        }
    }
}

module.exports.deleteSeriesFromSet = async function (req, res) {

    const seriesSetId = req.params.id;

    [err, isSuccess] = await to(testBundleService.deleteSeriesFromSet(seriesSetId));
    if (err) return ReE(res, err, 422);
    if (isSuccess == 1) {

        return ReS(res, 'Series remmoved  successfully.');

    } else {

        return ReE(res, 'Failed to remove series, please try again.');
    }
}


// Bundle
module.exports.createBundle = async function (req, res) {

    const accountId = req.user.account_id;
    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.selectedSet || body.selectedSet.length == 0) {

        return ReE(res, 'Please select set.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select paid bundle or not.', 422);

    } else if (body.isPaid == 1 && body.paymentGateWayId == null) {

        return ReE(res, 'Please select payment gateway.', 422);
    } else if (body.isPaid == 1 && body.paymentGateWayId != null && body.amount == null) {

        return ReE(res, 'Please enter bundle amount.', 422);

    } else if (body.isPaid == 1 && body.paymentGateWayId != null && body.amount != null && body.preview == null) {

        return ReE(res, 'Please enter preview string.', 422);
        
    } else if (body.isPaid == 1 && body.paymentGateWayId != null && body.amount != null && body.preview != null && body.validity == null) {

        return ReE(res, 'Please enter test bundle validity.', 422);
        
    } else if (body.isPaid == 1 && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
        
    } else {

        var bundleJSON = {

            accountId: accountId,
            title: body.title,
            isPublished: 1,
            isPaid: body.isPaid,
            paymentGateWayId: body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            amount: body.amount,
            validity: body.validity,
            preview: body.preview,
            create_ip: req.ip
        };

        if (body.currencyId) {

            bundleJSON.currencyId = body.currencyId;
        }

        [err, creatdBundle] = await to(testBundleService.addBundle(bundleJSON));
        if (err) return ReE(res, 'Failed to create bundle, please try again.', 422);
        if (creatdBundle) {

            var creatdBundleJSON = creatdBundle.toJSON();

            var setList = []
            body.selectedSet.forEach(setId => {

                setList.push({ bundleId: creatdBundleJSON.id, setId: setId, create_ip: req.ip });

            });

            [err, bundleSetList] = await to(testBundleService.addSetIntoBundle(setList));
            if (err) return ReE(res, 'Failed to create bundle, please try again.', 422);

            if (bundleSetList) {

                [err, bundle] = await to(testBundleService.getBundle(accountId, creatdBundleJSON.id));
                if (err) return ReE(res, err, 422);

                return ReS(res, 'Bundle created successfully.', bundle);

            } else {

                return ReS(res, 'Bundle created successfully.');
            }
        } else {

            return ReE(res, 'Failed to create bundle, please try again.', 422);
        }
    }
}

module.exports.getBundleList = async function (req, res) {

    const pageNo = parseInt(req.params.page);
    const pageLimit = parseInt(req.params.limit);

    const accountId = req.user.account_id;

    [err, bundleList] = await to(testBundleService.getBundleList(accountId, pageNo, pageLimit));
    if (err) return ReE(res, err, 422);

    if (bundleList.length == 0) {

        return ReE(res, 'Bundle list is empty.', 204);

    } else {

        return ReS(res, 'All Bundle List Got Successfully.', bundleList);
    }
}

module.exports.deleteBundle = async function (req, res) {

    const bundleId = req.params.id;
    const updateJSON = { delete: 1 };

    [err, isSuccess] = await to(testBundleService.updateBundle(bundleId, updateJSON));
    if (err) return ReE(res, err, 422);
    if (isSuccess.length == 1 && isSuccess[0] == 1) {

        return ReS(res, 'Bundle Deleted successfully.');

    } else {

        return ReE(res, 'Failed to delete bundle. please try again.');
    }
}

module.exports.addSetToBundle = async function (req, res) {

    const accountId = req.user.account_id;
    const body = req.fields;

    if (!body.bundleId) {

        return ReE(res, 'Please select bundle.', 422);

    } else if (!body.selectedSet || body.selectedSet.length == 0) {

        return ReE(res, "Please select set's.", 422);

    } else {

        const bundleId = body.bundleId;
        var setIdList = []

        await Promise.all(body.selectedSet.map(async (setId) => {

            [err, setResult] = await to(testBundleService.getBundleSet(setId, bundleId));
            if (setResult == null) {

                setIdList.push({ bundleId: bundleId, setId: setId, create_ip: req.ip });
            }
        }));


        [err, bundleSetList] = await to(testBundleService.addSetIntoBundle(setIdList));
        if (err) return ReE(res, err, 422);
        if (bundleSetList) {

            [err, bundle] = await to(testBundleService.getBundle(accountId, bundleId));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Set\'s added successfully.', bundle);

        } else {

            return ReE(res, 'Failed to add set. please try again.', 422);
        }
    }
}

module.exports.deleteSetFromBundle = async function (req, res) {

    const bundleSetId = req.params.id;

    [err, isSuccess] = await to(testBundleService.deleteSetFromBundle(bundleSetId));
    if (err) return ReE(res, err, 422);
    if (isSuccess == 1) {

        return ReS(res, 'Set remmoved  successfully.');

    } else {

        return ReE(res, 'Failed to remove set, please try again.');
    }
}

module.exports.updateBundle = async function (req, res) {

    const bundleId = req.params.id;
    const updateJSON = { isPublished: 1 };

    [err, isSuccess] = await to(testBundleService.updateBundle(bundleId, updateJSON));
    if (err) return ReE(res, err, 422);
    if (isSuccess.length == 1 && isSuccess[0] == 1) {

        return ReS(res, 'Bundle published successfully.');

    } else {

        return ReE(res, 'Failed to publish bundle. please try again.');
    }
}