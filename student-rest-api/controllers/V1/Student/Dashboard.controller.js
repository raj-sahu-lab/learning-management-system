const dashboardService = require('../../../services/V1/Student/Dashboard.service');
const { to, ReE, ReS, GetSignUrl, SendTextSMS } = require('../../../services/V1/util.service');

// Login Checking
module.exports.dashBordDetail = async function (req, res) {

    [err, defaultBranch] = await to(dashboardService.getDefaultBranch(req.user.id));
    if (err) return ReE(res, err, 422);

    if (!defaultBranch.defaultBranch) {

        return ReE(res, 'Please set your default branch.', 422);
    }

    [err, courseList] = await to(dashboardService.getCoursesList(defaultBranch.defaultBranch, req.user.id));
    if (err) return ReE(res, err, 422);

    [err, teacherListCount] = await to(dashboardService.getTutorList(defaultBranch.defaultBranch));
    if (err) return ReE(res, err, 422);

    [err, purchaseCount] = await to(dashboardService.getPurchaseCount(req.user.id));
    if (err) return ReE(res, err, 422);

    if (courseList.length == 0) {

        return ReS(res, 'Course List empty.', [], 204);

    } else {

        var courseSinged = []

        await Promise.all(courseList.map(async (course) => {

            var courseJson = course.toJSON();

            [err, percentage] = await to(dashboardService.calculatePercentage(courseJson.id, 'subject', req.user.id));
            if (percentage) {
                courseJson.progress = percentage.percentage ? percentage.percentage : 0;
            }

            courseJson.image = await GetSignUrl(courseJson.image);
            if (courseJson.tutor.image) {

                courseJson.tutor.image = await GetSignUrl(courseJson.tutor.image);
            }
            [err, purchase] = await to(dashboardService.checkPurchase(1, courseJson.id, req.user.id));
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
                    courseJson.purchase = purchaseJSON;

                } else {

                    courseJson.purchase = null;
                }
            } else {

                courseJson.purchase = null;
            }
            // to get subscribed user list
            [err, studentList] = await to(dashboardService.getCourseStudent(courseJson.id));
            if (studentList) {
                var userSigned = [];

                await Promise.all(studentList.map(async (user) => {

                    var userJson = user.student.toJSON();
                    userJson.image = await GetSignUrl(userJson.image);

                    userSigned.push(userJson);

                }));

                courseJson.userList = userSigned;
            } else {
                courseJson.userList = [];
            }
            courseSinged.push(courseJson);

        }));

        let responseJson = {
            courseCount: courseList.length,
            teacherCount: teacherListCount,
            purchasedCourseCount: purchaseCount,
            courseList: courseSinged
        };
        return ReS(res, 'Course List get successfully.', responseJson);
    }
}

module.exports.getSubjectTopicList = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else {

        [err, subject] = await to(dashboardService.getTopicForSubject(body.subjectId, req.user.id));
        if (err) return ReE(res, err, 422);
        if (subject) {

            var subjectJson = subject;
            subjectJson.image = await GetSignUrl(subjectJson.image);
            subjectJson.tutor.image = await GetSignUrl(subjectJson.tutor.image);

            [err, percentage] = await to(dashboardService.calculatePercentage(subjectJson.id, 'subject', req.user.id));
            if (percentage) {
                subjectJson.progress = percentage.percentage ? percentage.percentage : 0;
            }
            [err, purchase] = await to(dashboardService.checkPurchase(1, subjectJson.id, req.user.id));
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
                    subjectJson.purchase = purchaseJSON;

                } else {

                    subjectJson.purchase = null;
                }
            } else {

                subjectJson.purchase = null;
            }

            var topicSinged = [];

            await Promise.all(subjectJson.topics.map(async (topic) => {

                var topicJson = topic;

                [err, percentageTopic] = await to(dashboardService.calculatePercentage(topicJson.id, 'topic', req.user.id));
                if (percentageTopic) {
                    topicJson.progress = percentageTopic.percentage ? percentageTopic.percentage : 0;
                }

                [err, purchase] = await to(dashboardService.checkPurchase(2, topic.id, req.user.id));
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
                        topicJson.purchase = purchaseJSON;

                    } else {

                        topicJson.purchase = null;
                    }
                } else {

                    topicJson.purchase = null;
                }


                topicSinged.push(topicJson)

            }));

            subjectJson.topics = topicSinged;

            var userSigned = [];

            await Promise.all(subjectJson.userList.map(async (user) => {

                var userJson = user.student.toJSON();
                userJson.image = await GetSignUrl(userJson.image);

                userSigned.push(userJson);

            }));

            subjectJson.userList = userSigned;

            return ReS(res, 'Subject detail got successfully.', subjectJson);

        } else {

            return ReE(res, 'Subject not found.', 422);
        }

    }
}

module.exports.getTopiContentList = async function (req, res) {

    const body = req.fields;

    if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else {

        [err, content] = await to(dashboardService.getContentForTopic(body.topicId, req.user.id));
        if (err) return ReE(res, err, 422);

        if (content) {

            var contentJson = content;

            [err, percentage] = await to(dashboardService.calculatePercentage(contentJson.id, 'topic', req.user.id));
            if (percentage) {
                contentJson.progress = percentage.percentage ? percentage.percentage : 0;
            }

            contentJson.subject.image = await GetSignUrl(contentJson.subject.image);
            if (contentJson.subject.isPaid == 1) {

                [err, purchase] = await to(dashboardService.checkPurchase(1, contentJson.subject.id, req.user.id));
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
                        contentJson.subject.purchase = purchaseJSON;

                    } else {

                        contentJson.subject.purchase = null;
                    }
                } else {

                    contentJson.subject.purchase = null;
                }
            } else {

                contentJson.subject.purchase = null;
            }

            [err, purchase] = await to(dashboardService.checkPurchase(2, contentJson.id, req.user.id));
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
                    contentJson.purchase = purchaseJSON;

                } else {

                    contentJson.purchase = null;
                }
            } else {

                contentJson.purchase = null;
            }

            var contentSinged = [];

            await Promise.all(contentJson.contents.map(async (content) => {

                var contentsJson = content;

                [err, percentageContent] = await to(dashboardService.calculatePercentage(contentsJson.id, 'content', req.user.id));
                if (percentageContent) {
                    contentsJson.progress = percentageContent.percentage ? percentageContent.percentage : 0;
                }

                [err, purchase] = await to(dashboardService.checkPurchase(3, contentsJson.id, req.user.id));
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
                        contentsJson.purchase = purchaseJSON;

                    } else {

                        contentsJson.purchase = null;
                    }
                } else {

                    contentsJson.purchase = null;
                }


                contentSinged.push(contentsJson)

            }));

            contentJson.contents = contentSinged;

            return ReS(res, 'Content Detail got successfully.', contentJson);

        } else {

            return ReE(res, 'Content not found.', 422);
        }

    }
}


module.exports.getContentFilesList = async function (req, res) {

    const body = req.fields;

    if (!body.contentId) {

        return ReE(res, 'Please select content id.', 422);

    } else {

        var thumbnail = '';
        if (req.user.toJSON().branch.account.image) {

            thumbnail = await GetSignUrl(req.user.toJSON().branch.account.image);
        }

        [err, filesList] = await to(dashboardService.getContentFiles(body.contentId, req.user.id));
        if (err) return ReE(res, err, 422);

        if (filesList) {

            let responseJson = filesList.toJSON();

            [err, percentage] = await to(dashboardService.calculatePercentage(responseJson.id, 'content', req.user.id));
            if (percentage) {
                responseJson.progress = percentage.percentage ? percentage.percentage : 0;
            }

            if (responseJson.subject.isPaid == 1) {

                [err, purchase] = await to(dashboardService.checkPurchase(1, responseJson.subject.id, req.user.id));
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
                        responseJson.subject.purchase = purchaseJSON;

                    } else {

                        responseJson.subject.purchase = null;
                    }
                } else {

                    responseJson.subject.purchase = null;
                }
            } else {

                responseJson.subject.purchase = null;
            }

            if (responseJson.topic.isPaid == 1) {


                [err, purchase] = await to(dashboardService.checkPurchase(2, responseJson.topic.id, req.user.id));
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
                        responseJson.topic.purchase = purchaseJSON;

                    } else {

                        responseJson.topic.purchase = null;
                    }
                } else {

                    responseJson.topic.purchase = null;
                }
            } else {

                responseJson.topic.purchase = null;
            }

            if (responseJson.isPaid == 1) {

                [err, purchase] = await to(dashboardService.checkPurchase(3, responseJson.id, req.user.id));
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
                        responseJson.purchase = purchaseJSON;

                    } else {

                        responseJson.purchase = null;
                    }
                } else {

                    responseJson.purchase = null;
                }
            } else {

                responseJson.purchase = null;
            }

            [err, testList] = await to(dashboardService.getTestsList(body.contentId, req.user.id));

            var testListSinged = []

            await Promise.all(testList.map(async (test) => {

                var testJson = test.toJSON();

                [err, purchase] = await to(dashboardService.checkPurchase(4, testJson.id, req.user.id));
                if (purchase) {
                    let purchaseJSON = purchase.toJSON();
                    purchaseJSON.remainDays = purchaseJSON.dayLimit - purchaseJSON.remainDays;
                    testJson.purchase = purchaseJSON;
                } else {

                    testJson.purchase = null;
                }


                testListSinged.push(testJson)

            }));

            responseJson.tests = testListSinged;

            // [err, practiceList] = await to(dashboardService.getPracticeList(body.contentId));
            [err, practiceList] = await to(dashboardService.getPracticeList(body.contentId, req.user.id));
            responseJson.practice = practiceList;

            responseJson.subject.tutor.image = await GetSignUrl(responseJson.subject.tutor.image);

            // Sign All PDF Urls
            var pdfSignedList = [];
            await Promise.all(responseJson.pdf.map(async (pdf) => {

                var pdf = pdf;
                pdf.url = await GetSignUrl(pdf.url);

                if (pdf.isPaid == 1) {

                    [err, purchase] = await to(dashboardService.checkPurchase(6, pdf.id, req.user.id));
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
                            pdf.purchase = purchaseJSON;

                        } else {

                            pdf.purchase = null;
                        }
                    } else {

                        pdf.purchase = null;
                    }
                } else {

                    pdf.purchase = null;
                }

                pdfSignedList.push(pdf);

            }));
            responseJson.pdf = pdfSignedList;
            responseJson.pdfCount = pdfSignedList.length;

            // Sign All PPT Urls
            var pptSignedList = [];
            await Promise.all(responseJson.ppt.map(async (ppt) => {

                var ppt = ppt;
                ppt.url = await GetSignUrl(ppt.url);

                if (ppt.isPaid == 1) {

                    [err, purchase] = await to(dashboardService.checkPurchase(7, ppt.id, req.user.id));
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
                            ppt.purchase = purchaseJSON;

                        } else {

                            ppt.purchase = null;
                        }
                    } else {

                        ppt.purchase = null;
                    }
                } else {

                    ppt.purchase = null;
                }

                pptSignedList.push(ppt);

            }));
            responseJson.ppt = pptSignedList;
            responseJson.pptCount = pptSignedList.length;

            // Sign All Audio Urls
            var audioSignedList = [];
            await Promise.all(responseJson.audio.map(async (audio) => {

                var audio = audio;
                audio.url = await GetSignUrl(audio.url);

                if (audio.isPaid == 1) {

                    [err, purchase] = await to(dashboardService.checkPurchase(8, audio.id, req.user.id));
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
                            audio.purchase = purchaseJSON;

                        } else {

                            audio.purchase = null;
                        }
                    } else {

                        audio.purchase = null;
                    }
                } else {

                    audio.purchase = null;
                }
                audioSignedList.push(audio);

            }));
            responseJson.audio = audioSignedList;
            responseJson.audioCount = audioSignedList.length;

            // Sign All Video Urls
            var videoSignedList = [];
            await Promise.all(responseJson.video.map(async (video) => {

                var video = video;

                if (video.isPaid == 1) {

                    [err, purchase] = await to(dashboardService.checkPurchase(9, video.id, req.user.id));

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
                            video.purchase = purchaseJSON;

                        } else {

                            video.purchase = null;
                        }
                    } else {

                        video.purchase = null;
                    }
                } else {

                    video.purchase = null;
                }

                if (video.type == 0 && video.videoProcessingStatus == 2) {

                    video.url = await GetSignUrl(video.url);
                    video.thumbnail = thumbnail;
                    if (video.hlsURL) {
                        video.hlsURL = await GetSignUrl(video.hlsURL);
                    }

                    videoSignedList.push(video);

                } else if (video.type > 0) {

                    videoSignedList.push(video);
                }

            }));
            responseJson.video = videoSignedList;
            responseJson.videoCount = videoSignedList.length;

            return ReS(res, 'Content Detail got successfully', responseJson);


        } else {

            return ReE(res, 'Please content not found.', 422);
        }
    }
}


module.exports.getReviewSubjectList = async function (req, res) {

    [err, defaultBranch] = await to(dashboardService.getDefaultBranch(req.user.id));
    if (err) return ReE(res, err, 422);

    if (!defaultBranch.defaultBranch) {

        return ReE(res, 'Please set your default branch.', 422);
    }

    [err, courseList] = await to(dashboardService.getReviewCoursesList(defaultBranch.defaultBranch, req.user.id));
    if (err) return ReE(res, err, 422);

    if (courseList.length == 0) {

        return ReS(res, 'Review Course List empty.', [], 204);

    } else {


        var filteredList = [];
        for (let index = 0; index < courseList.length; index++) {

            var course = courseList[index].toJSON();

            if (course.reviews.length == 0) {

                delete course.reviews;
                filteredList.push(course);
            }
        }
        return ReS(res, 'Review course list get successfully.', filteredList);
    }
}