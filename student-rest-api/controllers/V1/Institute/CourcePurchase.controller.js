const purchaseService = require('../../../services/V1/Institute/CourcePurchase.service');
const purchaseServiceStudent = require('../../../services/V1/Student/Purchase.service');
const { to, ReE, ReS, GetSignUrl, SendContentPurchaseEmail } = require('../../../services/V1/util.service');



module.exports.addPurchase = async function (req, res) {

    const body = req.fields;

    if (!body.studentId) {

        return ReE(res, 'Please select students', 422);

    } else if (!body.type) {

        return ReE(res, 'Please enter purchase type.', 422);

    } else if (!body.id) {

        return ReE(res, 'Please enter id.', 422);

    } else if (!body.amount) {

        return ReE(res, 'Please enter amount.', 422);

    } else {


        var dayLimit = 0;
        var details;
        if (body.type == 1) {

            [err, subject] = await to(purchaseServiceStudent.getSubject(body.id));
            if (err) return ReE(res, err, 422);
            if (!subject)
                return ReE(res, 'Subject not found.', 422);

            dayLimit = subject.toJSON().validity;
            details = subject.toJSON();

        } else if (body.type == 2) {

            [err, topic] = await to(purchaseServiceStudent.getTopic(body.id));
            if (err) return ReE(res, err, 422);
            if (!topic)
                return ReE(res, 'Topic not found.', 422);
            dayLimit = topic.toJSON().validity;
            details = topic.toJSON();

        } else if (body.type == 3) {

            [err, content] = await to(purchaseServiceStudent.getContent(body.id));
            if (err) return ReE(res, err, 422);
            if (!content)
                return ReE(res, 'Content not found.', 422);
            dayLimit = content.toJSON().validity;
            details = content.toJSON();

        } else if (body.type == 6) {

            [err, pdf] = await to(purchaseServiceStudent.getPDF(body.id));
            if (err) return ReE(res, err, 422);
            if (!pdf)
                return ReE(res, 'Pdf not found.', 422);
            dayLimit = pdf.toJSON().validity;
            details = pdf.toJSON();

        } else if (body.type == 7) {

            [err, ppt] = await to(purchaseServiceStudent.getPPT(body.id));
            if (err) return ReE(res, err, 422);
            if (!ppt)
                return ReE(res, 'PPT not found.', 422);
            dayLimit = ppt.toJSON().validity;
            details = ppt.toJSON();

        } else if (body.type == 8) {

            [err, audio] = await to(purchaseServiceStudent.getAudio(body.id));
            if (err) return ReE(res, err, 422);
            if (!audio)
                return ReE(res, 'Audio not found.', 422);
            dayLimit = audio.toJSON().validity;
            details = audio.toJSON();

        } else if (body.type == 9) {

            [err, video] = await to(purchaseServiceStudent.getVideo(body.id));
            if (err) return ReE(res, err, 422);
            if (!video)
                return ReE(res, 'Video not found.', 422);
            dayLimit = video.toJSON().validity;
            details = video.toJSON();

        } else if(body.type == 10){

            [err, bundle] = await to(purchaseServiceStudent.getTestBundle(body.id));
            if (err) return ReE(res, err, 422);
            if(!bundle)
                return ReE(res, 'Test bundle not found.', 422);
            dayLimit = bundle.toJSON().validity;
            details = bundle.toJSON();
        }


        await Promise.all(body.studentId.split(',').map(async (studentId) => {

            [err, userDetail] = await to(purchaseService.getStudent(studentId));
            if (err) return ReE(res, err, 422);
            const purchaseJson = {

                student_id: studentId,
                account_id: req.user.account_id,
                type: body.type,
                typeId: body.id,
                dayLimit: dayLimit,
                create_ip: req.ip,
            };

            [err, purchase] = await to(purchaseService.addPurchase(purchaseJson));
            if (err) return ReE(res, err, 422);


            const purchaseDetailJson = {

                purchase_id: purchase.toJSON().id,
                transaction_id: body.transactionId ? body.transactionId : 'offlinePay',
                gateway_id: body.paymentGateWayId,
                payment_response: body.purchaseResponse,
                amount: body.amount,
                create_ip: req.ip,
            };

            if(body.currencyId){
                purchaseDetailJson.currencyId = body.currencyId;
            }

            [err, purchaseDetail] = await to(purchaseService.addPurchaseDetail(purchaseDetailJson));
            if (err) return ReE(res, err, 422);


            if (details) {

                await to(SendContentPurchaseEmail(userDetail, details));
            }

        }));


        return ReS(res, 'Product purchased successfully.');
    }
}

module.exports.getPurchaseList = async function (req, res) {

    [err, purchase] = await to(purchaseService.getPurchaseList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (purchase == null) {

        return ReS(res, 'Purchase List empty.', [], 204);

    } else {


        var purchaseListSinged = []

        // await Promise.all(purchase.map(async (purchase) => {
        for (let i = 0; i < purchase.length; i++) {

            let purchasedJson = purchase[i].toJSON();
            var details;

            if (purchasedJson.type == 1) {

                [err, subject] = await to(purchaseServiceStudent.getSubject(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (subject)
                    details = subject.toJSON();

            } else if (purchasedJson.type == 2) {

                [err, topic] = await to(purchaseServiceStudent.getTopic(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (topic)
                    details = topic.toJSON();

            } else if (purchasedJson.type == 3) {

                [err, content] = await to(purchaseServiceStudent.getContent(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (content)
                    details = content.toJSON();

            } else if (purchasedJson.type == 6) {

                [err, pdf] = await to(purchaseServiceStudent.getPDF(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (pdf)
                    details = pdf.toJSON();

            } else if (purchasedJson.type == 7) {

                [err, ppt] = await to(purchaseServiceStudent.getPPT(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (ppt)
                    details = ppt.toJSON();

            } else if (purchasedJson.type == 8) {

                [err, audio] = await to(purchaseServiceStudent.getAudio(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (audio)
                    details = audio.toJSON();

            } else if (purchasedJson.type == 9) {

                [err, video] = await to(purchaseServiceStudent.getVideo(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if (video)
                    details = video.toJSON();

            } else if(purchasedJson.type == 10){

                [err, bundle] = await to(purchaseServiceStudent.getTestBundle(purchasedJson.typeId));
                if (err) return ReE(res, err, 422);
                if(bundle)
                    details = bundle.toJSON();
            }

            if (details) {

                delete details.account;
                purchasedJson.detail = details;
            }

            if (req.user.userType == 3) {
                
                if (details) {

                    if (purchasedJson.type == 1 && details.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);

                    } else if (purchasedJson.type == 2 && details.subject.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);

                    } else if (purchasedJson.type == 3 && details.subject.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);

                    } else if (purchasedJson.type == 6 && details.subject.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);

                    } else if (purchasedJson.type == 7 && details.subject.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);

                    } else if (purchasedJson.type == 8 && details.subject.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);
                        
                    } else if (purchasedJson.type == 9 && details.subject.tutorId == req.user.id) {

                        purchaseListSinged.push(purchasedJson);
                    }

                }

            } else {

                purchaseListSinged.push(purchasedJson);
            }


        // }));
        }

        return ReS(res, 'Purchase list get successfully.', purchaseListSinged);
    }
}

// ---------------------------------------------- Subject, Topic ,  Content , Test ---------------------------------------------- 
module.exports.getAllType = async function (req, res) {

    const branchId = req.params.id;
    [err, subjectList] = await to(purchaseService.getSubjectList(req.user.account_id, branchId));
    if (err) return ReE(res, err, 422);

    [err, topicList] = await to(purchaseService.getTopicList(req.user.account_id, branchId));
    if (err) return ReE(res, err, 422);

    [err, contentList] = await to(purchaseService.getContentList(req.user.account_id, branchId));
    if (err) return ReE(res, err, 422);

    [err, testList] = await to(purchaseService.getTestList(req.user.account_id, branchId));
    if (err) return ReE(res, err, 422);

    [err, testBundleList] = await to(purchaseService.getTestBundleList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    [err, pdfList] = await to(purchaseService.getPdfList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    [err, pptList] = await to(purchaseService.getPptList(req.user.account_id));
    if (err) return ReE(res, err, 422);
    
    [err, audioList] = await to(purchaseService.getAudioList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    [err, videoList] = await to(purchaseService.getVideoList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    let responseJson = [
        { type: 1, title: 'Course Bundle', list: subjectList },
        { type: 2, title: 'Module', list: topicList },
        { type: 3, title: 'Lecture Content', list: contentList },
        { type: 4, title: 'Test', list: testList },
        { type: 10, title: 'Test Bundle', list: testBundleList },

        { type: 6, title: 'Pdf', list: pdfList },
        { type: 7, title: 'Ppt', list: pptList },
        { type: 8, title: 'Audio', list: audioList },
        { type: 9, title: 'Video', list: videoList }

    ];

    return ReS(res, 'All Data List Got Successfully.', responseJson);
}
// ---------------------------------------------- Subject, Topic ,  Content , Test ----------------------------------------------