const authInstitute = require('../../../services/V1/Institute/auth.service');
const coursesService = require('../../../services/V1/Institute/courses.service');
const tutorService = require('../../../services/V1/Institute/tutor.service');
const { to, ReE, ReS, UploadImage, GetSignUrl, DeleteFromBucket, UploadPdf } = require('../../../services/V1/util.service');
const { SendNotification } = require('../../../services/V1/notification.service');
const { DeleteFolderFromBucket, InitLamdaFunctionTranscoder } = require('../../../services/V1/aws.services');
const CONFIG = require('../../../config/config');
const fs = require('fs');


// ---------------------------------------------- Subject, Topic And related Tutor List ---------------------------------------------- 

module.exports.getSubjectTopic = async function (req, res) {

    [err, subjectTopicList] = await to(coursesService.getSubjectTopic(req.user));
    if (err) return ReE(res, err, 422);

    if (subjectTopicList.length == 0) {

        return ReE(res, 'List is empty.', 204);

    } else {

        return ReS(res, 'All Data List Got Successfully.', subjectTopicList);
    }
}

module.exports.getCurrencyList = async function (req, res) {

    [err, currencyList] = await to(coursesService.getCurrencyList());
    if (err) return ReE(res, err, 422);

    if (currencyList.length == 0) {

        return ReE(res, 'List is empty.', 204);

    } else {

        return ReS(res, 'All Currency List Got Successfully.', currencyList);
    }
}


// ---------------------------------------------- Subject, Topic And related Tutor List ---------------------------------------------- 

// ---------------------------------------------- Subject ---------------------------------------------- 

// Get All Subject List
module.exports.getAvailableSubject = async function (req, res) {

    if (req.user.userType == 3 || req.user.userType == 1) {

        [err, subjectList] = await to(coursesService.getSubjectList(req.user.account_id));
        if (err) return ReE(res, err, 422);

        if (subjectList.length == 0) {

            return ReE(res, 'Subject Not Available', 204);

        } else {

            var subjectSignedList = [];

            await Promise.all(subjectList.map(async (subject) => {

                var subject = subject.toJSON();
                subject.image = await GetSignUrl(subject.image);
                subjectSignedList.push(subject)

            }));

            return ReS(res, 'All Subject List Got Successfully.', subjectSignedList);
        }
    } else {

        return ReE(res, 'You don\'t have permission to perform the action.', 422);
    }
}

// Add New Subject
module.exports.createSubject = async function (req, res) {

    if (req.user.userType != 1) {

        return ReE(res, 'You don\'t have permission to perform the action.', 422);
    }

    const body = req.fields;

    if (req.files.image == null) {

        return ReE(res, 'Please select subject image.', 422);

    } else if (!body.tutorId) {

        return ReE(res, 'Please select tutor.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter preview.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter subject amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter subject preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter subject validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {


        [err, tutor] = await to(tutorService.getTutor(req.user.account_id, body.tutorId));
        if (err) return ReE(res, err, 422);
        if (!tutor) {
            return ReE(res, 'Tutor not found.', 422);
        }
        var tutorObj = tutor.toJSON();

        var imageBuffer = fs.readFileSync(req.files.image.path);
        var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        
        [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));

        if (err) return ReE(res, err, 422);

        let subjectBody = {

            account_id: req.user.account_id,
            tutor_id: body.tutorId,
            branch_id: tutorObj.branch.id,
            subject_title: body.title,
            subject_description: body.description,
            subject_image: s3Bucket.Key,
            subject_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 1 ? body.paymentGateWayId : null,
            subject_amount: body.isPaid == 1 ? body.amount : null,
            subject_preview: body.isPaid == 1 ? body.reviewText : null,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            create_ip: req.ip
        };

        if (body.currencyId) {

            subjectBody.currencyId = body.currencyId;
        }

        [err, subject] = await to(coursesService.addSubject(subjectBody));
        if (err) return ReE(res, err, 422);

        if (subject) {

            [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, subject.subject_id));
            var subjectObj = subjectObj.toJSON();
            subjectObj.image = await GetSignUrl(subjectObj.image);
            return ReS(res, 'Subject added successfully.', subjectObj);

        } else {

            return ReE(res, 'Failed to add subject, please try again.', 422);
        }
    }
}

// Update Subject
module.exports.updateSubject = async function (req, res) {

    if (req.user.userType != 1) {

        return ReE(res, 'You don\'t have permission to perform the action.', 422);
    }

    const body = req.fields;
    if (!body.subjectId) {

        return ReE(res, 'Please add subject id.', 422);

    } else if (!body.tutorId) {

        return ReE(res, 'Please select tutor.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter preview.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway..', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter subject amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter subject preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter subject validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (body.status == null) {

        return ReE(res, 'Please select subject status.', 422);
    } else {

        [err, tutor] = await to(tutorService.getTutor(req.user.account_id, body.tutorId));
        if (err) return ReE(res, err, 422);
        if (tutor == null) {
            return ReE(res, 'Selected tutor not found.', 422);
        }
        var tutorObj = tutor.toJSON();

        [err, subject] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);

        if (subject == null) {

            return ReE(res, 'Subject not found.', 422);
        }

        var subject = subject.toJSON();
        if (subject.tutor.id != body.tutorId) {

            [err, tSubject] = await to(coursesService.getTutorSubject(req.user.account_id, body.tutorId));
            if (err) return ReE(res, err, 422);
            if (tSubject) {

                return ReE(res, 'Tutor already assigned.', 422);
            }
        }

        var imageName = subject.image;

        if (req.files.image != null) {

            if (imageName != '') {

                [err, result] = await to(DeleteFromBucket(imageName));
                if (err) return ReE(res, err, 422);
            }

            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
            [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));

            if (err) return ReE(res, err, 422);
            imageName = s3Bucket.Key;
        }

        let subjectBody = {

            account_id: req.user.account_id,
            tutor_id: body.tutorId,
            branch_id: tutorObj.branch.id,
            subject_title: body.title,
            subject_description: body.description,
            subject_image: imageName,
            subject_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 1 ? body.paymentGateWayId : null,
            subject_amount: body.isPaid == 1 ? body.amount : null,
            subject_preview: body.isPaid == 1 ? body.reviewText : null,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            update_ip: req.ip,
            status: body.status
        };

        if (body.currencyId) {
            subjectBody.currencyId = body.currencyId;
        }

        [err, subject] = await to(coursesService.updateSubject(body.subjectId, subjectBody));
        if (err) return ReE(res, err, 422);

        if (subject.length === 1 && subject[0] == 1) {

            [err, subject] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));

            var subjectObj = subject.toJSON();
            subjectObj.image = await GetSignUrl(subjectObj.image);

            return ReS(res, 'Subject updated successfully.', subjectObj);

        } else {

            return ReE(res, 'Failed to update subject, please try again.', 422);
        }
    }
}

// Delete Subject
module.exports.deleteSubject = async function (req, res) {

    if (req.user.userType != 1) {

        return ReE(res, 'You don\'t have permission to perform the action.', 422);
    }

    if (!req.params.id) {

        return ReE(res, 'Subject id missing.');

    } else {

        [err, subject] = await to(coursesService.deleteSubject(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (subject.length === 1 && subject[0] == 1) {

            return ReS(res, 'Subject deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete subject. please try again.');
        }
    }
}


// ---------------------------------------------- Subject ---------------------------------------------- 


// ---------------------------------------------- Topic ---------------------------------------------- 

// Get All Topic List
module.exports.getAvailableTopic = async function (req, res) {

    const body = req.fields;

    [err, topicList] = await to(coursesService.getTopicList(req.user, body.subjectId));
    if (err) return ReE(res, err, 422);


    if (topicList.length == 0) {

        return ReE(res, 'Topic Not Available', 204);

    } else {

        return ReS(res, 'All Topic List Got Successfully.', topicList);
    }


}

// Add New Topic
module.exports.createTopic = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway..', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter topic amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter topic preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter topic validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        let topicBody = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_title: body.title,
            topic_description: body.description,
            topic_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 1 ? body.paymentGateWayId : null,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            topic_amount: body.isPaid == 1 ? body.amount : null,
            topic_preview: body.isPaid == 1 ? body.reviewText : null,
            create_ip: req.ip,
        };

        if (body.currencyId) {

            topicBody.currencyId = body.currencyId;
        }

        [err, topic] = await to(coursesService.addTopic(topicBody));
        if (err) return ReE(res, err, 422);

        if (topic) {

            [err, topic] = await to(coursesService.getTopic(req.user.account_id, topic.topic_id));
            return ReS(res, 'Topic added successfully.', topic);

        } else {

            return ReE(res, 'Failed to add topic, please try again.', 422);
        }
    }
}

// Update Topic
module.exports.updateTopic = async function (req, res) {

    const body = req.fields;
    if (!body.topicId) {

        return ReE(res, 'Please enter topic id.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway..', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter topic amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter topic preview text.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter topic validity.', 422);

    } else if (body.status == null) {

        return ReE(res, 'Please select topic status.', 422);

    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        let topicBody = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_title: body.title,
            topic_description: body.description,
            topic_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 1 ? body.paymentGateWayId : null,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            topic_amount: body.isPaid == 1 ? body.amount : null,
            topic_preview: body.isPaid == 1 ? body.reviewText : null,
            update_ip: req.ip,
            status: body.status
        };

        if (body.currencyId) {

            topicBody.currencyId = body.currencyId;
        }

        [err, topic] = await to(coursesService.updateTopic(body.topicId, topicBody));
        if (err) return ReE(res, err, 422);

        if (topic.length === 1 && topic[0] == 1) {

            [err, topic] = await to(coursesService.getTopic(req.user.account_id, body.topicId));
            return ReS(res, 'Topic updated successfully.', topic);

        } else {

            return ReE(res, 'Failed to update topic, please try again.', 422);
        }
    }
}

// Delete Topic
module.exports.deleteTopic = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Topic id missing.');

    } else {

        [err, topic] = await to(coursesService.deleteTopic(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (topic.length === 1 && topic[0] == 1) {

            return ReS(res, 'Topic deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete topic. please try again.');
        }
    }
}

// ---------------------------------------------- Topic ---------------------------------------------- 


// ---------------------------------------------- Content ---------------------------------------------- 

//Add New Content
module.exports.addContent = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter content amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter content preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter content validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();



        let content = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_title: body.title,
            content_description: body.description,
            content_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 1 ? body.paymentGateWayId : null,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            content_amount: body.isPaid == 1 ? body.amount : null,
            content_preview: body.isPaid == 1 ? body.reviewText : null,
            content_test: body.isAddTest ? body.isAddTest : true,
            content_practice: body.isAddPractice ? body.isAddPractice : true,
            create_ip: req.ip,
        };

        if (body.currencyId) {

            content.currencyId = body.currencyId;
        }

        [err, content] = await to(coursesService.addContent(content));
        if (err) return ReE(res, err, 422);

        // After Inserting Content We need to check weather user uploaded any files or not
        if (content) {

            const contentId = content.content_id;

            // Checking and adding PDF File
            if (req.files != null && req.files.pdf != null) {

                var pdfBuffer = fs.readFileSync(req.files.pdf.path);
                var name = 'TOA_PDF_' + (new Date().getTime().toString()) + '.pdf';
                [err, s3Bucket] = await to(UploadPdf(req.user.account_id, name, pdfBuffer));
                if (err) return ReE(res, err, 422);

                let pdf = {

                    account_id: req.user.account_id,
                    subject_id: body.subjectId,
                    branch_id: subjectObj.tutor.branch.id,
                    topic_id: body.topicId,
                    content_id: contentId,
                    pdf_title: body.pdfTitle,
                    pdf_url: s3Bucket.Key,
                    downloadable: body.downloadable,
                    pdf_type: body.pdfIsPaid != null ? body.pdfIsPaid : 0,
                    validity: body.pdfIsPaid != null ? body.pdfValidity : 0,
                    paymentgateway_id: body.pdfIsPaid == 0 ? null : (body.pdfPaymentGateWayId == null ? null : body.pdfPaymentGateWayId),
                    iosPaymentGateWayid: body.pdfIsPaid == 1 ? body.iosPDFPaymentGateWayid : null,
                    pdf_amount: body.pdfIsPaid == 0 ? null : (body.pdfAmount == null ? null : body.pdfAmount),
                    pdf_preview: body.pdfIsPaid == 0 ? null : (body.pdfReviewText == null ? null : body.pdfReviewText),
                    create_ip: req.ip,
                };

                if (body.currencyIdPDF) {

                    pdf.currencyId = body.currencyIdPDF;
                }

                [err, pdf] = await to(coursesService.addPDF(pdf));
                if (err) return ReE(res, err, 422);
            }

            // Checking and adding PPT File
            if (req.files != null && req.files.ppt != null) {

                var pptBuffer = fs.readFileSync(req.files.ppt.path);
                var name = 'TOA_PPT_' + (new Date().getTime().toString()) + '_' + req.files.ppt.name;
                [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, pptBuffer));
                if (err) return ReE(res, err, 422);

                let ppt = {

                    account_id: req.user.account_id,
                    branch_id: subjectObj.tutor.branch.id,
                    subject_id: body.subjectId,
                    topic_id: body.topicId,
                    content_id: contentId,
                    ppt_title: body.pptTitle,
                    ppt_url: s3Bucket.Key,
                    ppt_type: body.pptIsPaid != null ? body.pptIsPaid : 0,
                    validity: body.pptIsPaid != null ? body.pptValidity : 0,
                    paymentgateway_id: body.pptIsPaid == 0 ? null : (body.pptPaymentGateWayId == null ? null : body.pptPaymentGateWayId),
                    iosPaymentGateWayid: body.pptIsPaid == 1 ? body.iosPPTPaymentGateWayid : null,
                    ppt_amount: body.pptIsPaid == 0 ? null : (body.pptAmount == null ? null : body.pptAmount),
                    ppt_preview: body.pptIsPaid == 0 ? null : (body.pptReviewText == null ? null : body.pptReviewText),
                    create_ip: req.ip,
                };
                if (body.currencyIdPPT) {

                    ppt.currencyId = body.currencyIdPPT;
                }


                [err, ppt] = await to(coursesService.addPPT(ppt));
                if (err) return ReE(res, err, 422);
            }

            // Checking and adding Audio File
            if (body.audioUrl != null) {

                let audio = {

                    account_id: req.user.account_id,
                    branch_id: subjectObj.tutor.branch.id,
                    subject_id: body.subjectId,
                    topic_id: body.topicId,
                    content_id: contentId,
                    audio_title: body.audioTitle,
                    audio_url: body.audioUrl,
                    audio_duration: body.audioDuration,
                    audio_type: body.audioIsPaid != null ? body.audioIsPaid : 0,
                    validity: body.audioIsPaid != null ? body.audioValidity : 0,
                    paymentgateway_id: body.audioIsPaid == 0 ? null : (body.audioPaymentGateWayId == null ? null : body.audioPaymentGateWayId),
                    iosPaymentGateWayid: body.audioIsPaid == 1 ? body.iosAudioPaymentGateWayid : null,
                    audio_amount: body.audioIsPaid == 0 ? null : (body.audioAmount == null ? null : body.audioAmount),
                    audio_preview: body.audioIsPaid == 0 ? null : (body.audioReviewText == null ? null : body.audioReviewText),
                    create_ip: req.ip,
                };

                if (body.currencyIdAudio) {

                    audio.currencyId = body.currencyIdAudio;
                }

                [err, audio] = await to(coursesService.addAudio(audio));
                if (err) return ReE(res, err, 422);
            }

            // Checking and adding Video
            if (body.videoTitle != null && body.videoTitle != '' && body.videoStreamType != null && body.videoStreamURL != null && body.videoStreamURL != '') {

                let video = {

                    account_id: req.user.account_id,
                    branch_id: subjectObj.tutor.branch.id,
                    subject_id: body.subjectId,
                    topic_id: body.topicId,
                    content_id: contentId,
                    video_title: body.videoTitle,
                    video_stream_type: body.videoStreamType,
                    video_url: body.videoStreamURL,
                    // videoHLSURL: body.videoStreamURL,
                    videoProcessingStatus: 1,
                    video_type: body.videoIsPaid != null ? body.videoIsPaid : 0,
                    validity: body.videoIsPaid != null ? body.videoValidity : 0,
                    paymentgateway_id: body.videoIsPaid == 0 ? null : (body.videoPaymentGateWayId == null ? null : body.videoPaymentGateWayId),
                    iosPaymentGateWayid: body.videoIsPaid == 1 ? body.iosVideoPaymentGateWayid : null,
                    video_amount: body.videoIsPaid == 0 ? null : (body.videoAmount == null ? null : body.videoAmount),
                    video_preview: body.videoIsPaid == 0 ? null : (body.videoReviewText == null ? null : body.videoReviewText),
                    create_ip: req.ip,
                };

                if (body.videoDuration != null) {

                    video.video_duration = body.videoDuration;
                }

                if (body.currencyIdVideo) {

                    video.currencyId = body.currencyIdVideo;
                }
                [err, video] = await to(coursesService.addVideo(video));
                if (err) return ReE(res, err, 422);

                if (video) {

                    let videoObj = video.toJSON();

                    const payload = { videoId: videoObj.video_id, key: videoObj.video_url, accountId: req.user.account_id, videoHeight: body.videoHeight, videoWidth: body.videoWidth };
                    [err, lamda] = await to(InitLamdaFunctionTranscoder(payload));
                    if (err) return ReE(res, err, 422);
                    if (lamda) {

                        let videoJSON = { videoTransmissionId: lamda.Job.Id };
                        [err, video] = await to(coursesService.updateVideo(videoObj.video_id, videoJSON));
                        if (err) return ReE(res, err, 422);
                    }
                }

            }

            [err, content] = await to(coursesService.getContent(req.user.account_id, contentId));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Content added successfully.', content);

        } else {

            return ReE(res, 'Failed to add content, please try again.', 422);
        }
    }
}

//Update New Content
module.exports.updateContent = async function (req, res) {

    const body = req.fields;

    if (!body.contentId) {

        return ReE(res, 'Content id missing.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter description.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter content amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter content preview text.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter content validity.', 422);

    } else if (!body.status) {

        return ReE(res, 'Please select status.', 422);

    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        let content = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_title: body.title,
            content_description: body.description,
            content_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 1 ? body.paymentGateWayId : null,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            content_amount: body.isPaid == 1 ? body.amount : null,
            content_preview: body.isPaid == 1 ? body.reviewText : null,
            content_test: body.isAddTest ? body.isAddTest : true,
            content_practice: body.isAddPractice ? body.isAddPractice : true,
            update_ip: req.ip,
            status: body.status
        };

        if (body.currencyId) {

            content.currencyId = body.currencyId;
        }

        [err, content] = await to(coursesService.updateContent(content, body.contentId));
        if (err) return ReE(res, err, 422);

        // After Inserting Content We need to check weather user uploaded any files or not
        if (content.length == 1 && content[0] == 1) {

            [err, content] = await to(coursesService.getContent(req.user.account_id, body.contentId));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Content update successfully.', content);

        } else {

            return ReE(res, 'Failed to add update, please try again.', 422);
        }
    }
}

// Get All Content List
module.exports.getContentList = async function (req, res) {

    [err, contentList] = await to(coursesService.getContentList(req.user));
    if (err) return ReE(res, err, 422);
    if (contentList.length == 0) {

        return ReE(res, 'Content Not Available', 204);

    } else {

        return ReS(res, 'All Content List Got Successfully.', contentList);
    }
}

// Delete Content
module.exports.deleteContent = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Content id missing.');

    } else {

        [err, isSuccess] = await to(coursesService.deleteContent(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Content deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete content. please try again.');
        }
    }
}

// ---------------------------------------------- Content ---------------------------------------------- 


// ---------------------------------------------- PDF ---------------------------------------------- 

//Add New PDF
module.exports.addPDF = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.downloadable == null) {

        return ReE(res, 'Please select PDF downloadable ?', 422);

    } else if (req.files.pdf == null) {

        return ReE(res, 'Please select PDF file.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter pdf amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter pdf preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter pdf validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        var pdfBuffer = fs.readFileSync(req.files.pdf.path);
        var name = 'TOA_PDF_' + (new Date().getTime().toString()) + '.pdf';

        [err, s3Bucket] = await to(UploadPdf(req.user.account_id, name, pdfBuffer));
        if (err) return ReE(res, err, 422);

        var pdf = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            pdf_title: body.title,
            pdf_url: s3Bucket.Key,
            pdf_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            pdf_amount: body.isPaid == 0 ? null : body.amount,
            pdf_preview: body.isPaid == 0 ? null : body.reviewText,
            downloadable: body.downloadable,
            create_ip: req.ip,
        };

        if (body.currencyId) {

            pdf.currencyId = body.currencyId;
        }

        [err, pdf] = await to(coursesService.addPDF(pdf));
        if (err) return ReE(res, err, 422);

        if (pdf) {

            [err, pdfObj] = await to(coursesService.getPDF(req.user.account_id, pdf.pdf_id));
            if (err) return ReE(res, err, 422);

            if (pdfObj) {

                var pdfObj = pdfObj.toJSON();
                pdfObj.url = await GetSignUrl(pdfObj.url);
                return ReS(res, 'PDF added successfully.', pdfObj);

            } else {

                return ReE(res, 'Failed to add PDF, please try again.', 422);
            }
        } else {

            return ReE(res, 'Failed to add PDF, please try again.', 422);
        }
    }
}

//Add New Update
module.exports.updatePDF = async function (req, res) {

    const body = req.fields;

    if (!body.pdfId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.downloadable == null) {

        return ReE(res, 'Please select PDF downloadable ?', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter pdf amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter pdf preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter pdf validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (!body.status) {

        return ReE(res, 'Please select status.', 422);

    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        [err, pdfObj] = await to(coursesService.getPDF(req.user.account_id, body.pdfId));
        if (err) return ReE(res, err, 422); 3
        if (!pdfObj) return ReE(res, 'Pdf not found.', 422);

        var pdfUrl = pdfObj.toJSON().url;

        if (req.files.pdf != null) {

            if (pdfUrl != '') {

                [err, result] = await to(DeleteFromBucket(pdfUrl));
                if (err) return ReE(res, err, 422);
            }

            var pdfBuffer = fs.readFileSync(req.files.pdf.path);
            var name = 'TOA_PDF_' + (new Date().getTime().toString()) + '.pdf';
            [err, s3Bucket] = await to(UploadPdf(req.user.account_id, name, pdfBuffer));
            if (err) return ReE(res, err, 422);
            pdfUrl = s3Bucket.Key;

        }

        let pdf = {
            pdf_id: body.pdfId,
            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            pdf_title: body.title,
            pdf_url: pdfUrl,
            pdf_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            pdf_amount: body.isPaid == 0 ? null : body.amount,
            pdf_preview: body.isPaid == 0 ? null : body.reviewText,
            downloadable: body.downloadable,
            update_ip: req.ip,
            status: body.status
        };
        if (body.currencyId) {

            pdf.currencyId = body.currencyId;
        }
        [err, pdf] = await to(coursesService.updatePDF(body.pdfId, pdf));
        if (err) return ReE(res, err, 422);

        if (pdf.length == 1 && pdf[0] == 1) {

            [err, pdfObj] = await to(coursesService.getPDF(req.user.account_id, body.pdfId));
            var pdfObj = pdfObj.toJSON();
            pdfObj.url = await GetSignUrl(pdfObj.url);
            return ReS(res, 'PDF updated successfully.', pdfObj);

        } else {

            return ReE(res, 'Failed to add PDF, please try again.', 422);
        }
    }
}

// Get All PDF File List
module.exports.getPDFList = async function (req, res) {

    [err, pdfList] = await to(coursesService.getPDFList(req.user));
    if (err) return ReE(res, err, 422);

    if (pdfList.length == 0) {

        return ReE(res, 'PDF List Not Available', 204);

    } else {

        var pdfSignedList = [];

        await Promise.all(pdfList.map(async (pdf) => {

            var pdf = pdf.toJSON();
            pdf.url = await GetSignUrl(pdf.url);
            pdfSignedList.push(pdf)

        }));
        return ReS(res, 'All PDF List Got Successfully.', pdfSignedList);
    }
}

// Delete PDF
module.exports.deletePDF = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'PDF id missing.');

    } else {

        [err, isSuccess] = await to(coursesService.deletePDF(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'PDF deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete pdf. please try again.');
        }
    }
}

// ---------------------------------------------- PDF ---------------------------------------------- 


// ---------------------------------------------- PPT ---------------------------------------------- 

//Add New PPT
module.exports.addPPT = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (req.files.ppt == null) {

        return ReE(res, 'Please select PPT file.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter ppt amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter ppt preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter ppt validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {


        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        var pptBuffer = fs.readFileSync(req.files.ppt.path);
        var name = 'TOA_PPT_' + (new Date().getTime().toString()) + '.ppt';

        [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, pptBuffer));
        if (err) return ReE(res, err, 422);

        let ppt = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            ppt_title: body.title,
            ppt_url: s3Bucket.Key,
            ppt_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            ppt_amount: body.isPaid == 0 ? null : body.amount,
            ppt_preview: body.isPaid == 0 ? null : body.reviewText,
            create_ip: req.ip,
        };

        if (body.currencyId) {

            ppt.currencyId = body.currencyId;
        }

        [err, ppt] = await to(coursesService.addPPT(ppt));
        if (err) return ReE(res, err, 422);

        if (ppt) {

            [err, pptObj] = await to(coursesService.getPPT(req.user.account_id, ppt.ppt_id));
            var pptObj = pptObj.toJSON();
            pptObj.url = await GetSignUrl(pptObj.url);
            return ReS(res, 'PPT added successfully.', pptObj);

        } else {

            return ReE(res, 'Failed to add PPT, please try again.', 422);
        }
    }
}

//Add New Update
module.exports.updatePPT = async function (req, res) {

    const body = req.fields;

    if (!body.pptId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter ppt amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter ppt preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter ppt validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (!body.status) {

        return ReE(res, 'Please select status.', 422);

    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        [err, pptObj] = await to(coursesService.getPPT(req.user.account_id, body.pptId));
        if (err) return ReE(res, err, 422); 3
        if (!pptObj) return ReE(res, 'PPT not found.', 422);

        var pptUrl = pptObj.toJSON().url;

        if (req.files.ppt != null) {

            if (pptUrl != '') {

                [err, result] = await to(DeleteFromBucket(pptUrl));
                if (err) return ReE(res, err, 422);
            }

            var pptBuffer = fs.readFileSync(req.files.ppt.path);
            var name = 'TOA_PPT_' + (new Date().getTime().toString()) + '.ppt';
            [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, pptBuffer));
            if (err) return ReE(res, err, 422);
            pptUrl = s3Bucket.Key;

        }

        let ppt = {
            ppt_id: body.pptId,
            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            ppt_title: body.title,
            ppt_url: pptUrl,
            ppt_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            ppt_amount: body.isPaid == 0 ? null : body.amount,
            ppt_preview: body.isPaid == 0 ? null : body.reviewText,
            update_ip: req.ip,
            status: body.status
        };

        if (body.currencyId) {

            ppt.currencyId = body.currencyId;
        }

        [err, ppt] = await to(coursesService.updatePPT(body.pptId, ppt));
        if (err) return ReE(res, err, 422);

        if (ppt.length == 1 && ppt[0] == 1) {

            [err, pptObj] = await to(coursesService.getPPT(req.user.account_id, body.pptId));
            var pptObj = pptObj.toJSON();
            pptObj.url = await GetSignUrl(pptObj.url);
            return ReS(res, 'PPT updated successfully.', pptObj);

        } else {

            return ReE(res, 'Failed to update PPT, please try again.', 422);
        }
    }
}

// Get All PPT File List
module.exports.getPPTList = async function (req, res) {

    [err, pptList] = await to(coursesService.getPPTList(req.user));
    if (err) return ReE(res, err, 422);


    if (pptList.length == 0) {

        return ReE(res, 'PPT List Not Available', 204);

    } else {

        var pptSignedList = [];

        await Promise.all(pptList.map(async (ppt) => {

            var ppt = ppt.toJSON();
            ppt.url = await GetSignUrl(ppt.url);
            pptSignedList.push(ppt)

        }));
        return ReS(res, 'All PPT List Got Successfully.', pptSignedList);
    }
}

// Delete PPT
module.exports.deletePPT = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'PPT id missing.');

    } else {

        [err, isSuccess] = await to(coursesService.deletePPT(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'PPT deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete ppt. please try again.');
        }
    }
}

// ---------------------------------------------- PPT ---------------------------------------------- 

// ---------------------------------------------- Audio ---------------------------------------------- 

//Add New Audio
module.exports.addAudio = async function (req, res) {

    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.audioUrl == null) {

        return ReE(res, 'Please select Audio file.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter audio amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter audio preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter audio validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {


        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        // var audioBuffer = fs.readFileSync(req.files.audio.path);
        // var name = 'TOA_Audio_' + (new Date().getTime().toString()) + '.mp3';
        // [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, audioBuffer));
        // if (err) return ReE(res, err, 422);

        let audio = {

            account_id: req.user.account_id,
            subject_id: body.subjectId,
            branch_id: subjectObj.tutor.branch.id,
            topic_id: body.topicId,
            content_id: body.contentId,
            audio_title: body.title,
            audio_url: body.audioUrl,
            audio_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            audio_amount: body.isPaid == 0 ? null : body.amount,
            audio_preview: body.isPaid == 0 ? null : body.reviewText,
            create_ip: req.ip,
        };

        if (body.currencyId) {

            audio.currencyId = body.currencyId;
        }

        if (body.duration != null) {

            audio.audio_duration = body.duration;
        }

        [err, audio] = await to(coursesService.addAudio(audio));
        if (err) return ReE(res, err, 422);

        if (audio) {

            [err, audioObj] = await to(coursesService.getAudio(req.user.account_id, audio.audio_id));
            var audioObj = audioObj.toJSON();
            audioObj.url = await GetSignUrl(audioObj.url);
            return ReS(res, 'Audio added successfully.', audioObj);

        } else {

            return ReE(res, 'Failed to add Audio, please try again.', 422);
        }
    }
}

//Add New Update
module.exports.updateAudio = async function (req, res) {

    const body = req.fields;

    if (!body.audioId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter audio amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter audio preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter audio validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (!body.status) {

        return ReE(res, 'Please select status.', 422);

    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        [err, audioObj] = await to(coursesService.getAudio(req.user.account_id, body.audioId));
        if (err) return ReE(res, err, 422); 3
        if (!audioObj) return ReE(res, 'Pdf not found.', 422);

        var audioUrl = audioObj.toJSON().url;

        if (body.audioUrl != null) {

            if (audioUrl != '') {

                [err, result] = await to(DeleteFromBucket(audioUrl));
                if (err) return ReE(res, err, 422);
            }

            // var audioBuffer = fs.readFileSync(req.files.audio.path);
            // var name = 'TOA_Audio_' + (new Date().getTime().toString()) + '.mp3';
            // [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, audioBuffer));
            // if (err) return ReE(res, err, 422);
            audioUrl = body.audioUrl;

        }

        let audio = {
            audio_id: body.audioId,
            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            audio_title: body.title,
            audio_url: audioUrl,
            audio_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            audio_amount: body.isPaid == 0 ? null : body.amount,
            audio_preview: body.isPaid == 0 ? null : body.reviewText,
            update_ip: req.ip,
            status: body.status
        };

        if (body.currencyId) {

            audio.currencyId = body.currencyId;
        }

        if (body.duration != null) {

            audio.audio_duration = body.duration;
        }

        [err, audio] = await to(coursesService.updateAudio(body.audioId, audio));
        if (err) return ReE(res, err, 422);

        if (audio.length == 1 && audio[0] == 1) {

            [err, audioObj] = await to(coursesService.getAudio(req.user.account_id, body.audioId));
            var audioObj = audioObj.toJSON();
            audioObj.url = await GetSignUrl(audioObj.url);
            return ReS(res, 'Audio updated successfully.', audioObj);

        } else {

            return ReE(res, 'Failed to update Audio, please try again.', 422);
        }
    }
}

// Get All Audio File List
module.exports.getAudioList = async function (req, res) {

    [err, audioList] = await to(coursesService.getAudioList(req.user));
    if (err) return ReE(res, err, 422);


    if (audioList.length == 0) {

        return ReE(res, 'Audio List Not Available', 204);

    } else {

        var audioSignedList = [];

        await Promise.all(audioList.map(async (audio) => {

            var audio = audio.toJSON();
            audio.url = await GetSignUrl(audio.url);
            audioSignedList.push(audio)

        }));
        return ReS(res, 'All Audio List Got Successfully.', audioSignedList);
    }
}

// Delete Audio
module.exports.deleteAudio = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Audio id missing.');

    } else {

        [err, isSuccess] = await to(coursesService.deleteAudio(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Audio deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete audio. please try again.');
        }
    }
}

// ---------------------------------------------- Audio ---------------------------------------------- 


// ---------------------------------------------- Video ---------------------------------------------- 

//Add New Video
module.exports.addVideo = async function (req, res) {


    const body = req.fields;

    if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.streamURL) {

        return ReE(res, 'Please select video or add link.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter video amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter video preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter video validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        let video = {

            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            video_title: body.title,
            video_stream_type: body.streamType,
            video_url: body.streamURL,
            videoProcessingStatus: 2,
            video_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            video_amount: body.isPaid == 0 ? null : body.amount,
            video_preview: body.isPaid == 0 ? null : body.reviewText,
            create_ip: req.ip,
        };

        if (body.currencyId) {

            video.currencyId = body.currencyId;
        }

        if (body.duration != null) {

            video.video_duration = body.duration;
        }


        [err, video] = await to(coursesService.addVideo(video));
        if (err) return ReE(res, err, 422);

        if (video) {


            [err, videoObj] = await to(coursesService.getVideo(req.user.account_id, video.video_id));
            if (err) return ReE(res, err, 422);
            var videoObj = videoObj.toJSON();

            const payload = { videoId: videoObj.id, key: videoObj.url, accountId: req.user.account_id, videoHeight: body.videoHeight, videoWidth: body.videoWidth };
            [err, lamda] = await to(InitLamdaFunctionTranscoder(payload));
            if (err) return ReE(res, err, 422);
            if (lamda) {

                let videoJSON = { videoTransmissionId: lamda.Job.Id };
                [err, video] = await to(coursesService.updateVideo(videoObj.id, videoJSON));
                if (err) return ReE(res, err, 422);
            }

            if (videoObj.type == 0) {

                videoObj.url = await GetSignUrl(videoObj.url);
            }


            return ReS(res, 'Video added successfully.', videoObj);

        } else {

            return ReE(res, 'Failed to add Video, please try again.', 422);
        }
    }
}

// Update Existing Video
module.exports.updateVideo = async function (req, res) {

    const body = req.fields;

    if (!body.videoId) {

        return ReE(res, 'Please select video.', 422);

    } else if (!body.subjectId) {

        return ReE(res, 'Please select subject.', 422);

    } else if (!body.topicId) {

        return ReE(res, 'Please select topic.', 422);

    } else if (!body.contentId) {

        return ReE(res, 'Please select content.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.isPaid == null) {

        return ReE(res, 'Please select payment type.', 422);

    } else if (body.isPaid == true && !body.paymentGateWayId) {

        return ReE(res, 'Please select payment gateway.', 422);

    } else if (body.isPaid == true && !body.amount) {

        return ReE(res, 'Please enter video amount.', 422);

    } else if (body.isPaid == true && !body.reviewText) {

        return ReE(res, 'Please enter video preview text.', 422);

    } else if (body.isPaid == true && !body.validity) {

        return ReE(res, 'Please enter video validity.', 422);

    } else if (body.isPaid == true && body.iosPaymentGateWayid == null) {

        return ReE(res, 'Please select ios payment gateway.', 422);
    } else if (body.status == null) {

        return ReE(res, 'Please select video status.', 422);

    } else {

        [err, subjectObj] = await to(coursesService.getSubject(req.user.account_id, body.subjectId));
        if (err) return ReE(res, err, 422);
        var subjectObj = subjectObj.toJSON();

        [err, videoObj] = await to(coursesService.getVideo(req.user.account_id, body.videoId));
        if (err) return ReE(res, err, 422); 3
        if (!videoObj) return ReE(res, 'Video not found.', 422);

        var videoURL = videoObj.toJSON().url;
        var videoType = videoObj.toJSON().type;
        var processingStatus =  videoObj.toJSON().processingStatus;
        var videoTransmissionId = '';
        if (body.streamType != null && body.streamURL != null && body.streamURL != '') {

            if (body.streamType == 0 && videoURL != '' && videoType == 0) {

                [err, result] = await to(DeleteFromBucket(videoURL));
                if (err) return ReE(res, err, 422);

                if (videoObj.toJSON().hlsURL && videoObj.toJSON().hlsURL != '') {
                    let array = videoObj.toJSON().hlsURL.split('/')
                    array.pop();
                    let deletePath = array.join('/');

                    [err, result] = await to(DeleteFolderFromBucket(deletePath));
                    if (err) return ReE(res, err, 422);

                }

                const payload = { videoId: body.videoId, key: body.streamURL, accountId: req.user.account_id, videoHeight: body.videoHeight, videoWidth: body.videoWidth };
                [err, lamda] = await to(InitLamdaFunctionTranscoder(payload));
                if (err) return ReE(res, err, 422);
                if (lamda) {
                    videoTransmissionId = lamda.Job.Id;
                    processingStatus = 1;
                }
            }

            videoType = body.streamType;
            videoURL = body.streamURL;
        }


        let video = {
            video_id: body.videoId,
            account_id: req.user.account_id,
            branch_id: subjectObj.tutor.branch.id,
            subject_id: body.subjectId,
            topic_id: body.topicId,
            content_id: body.contentId,
            video_title: body.title,
            video_stream_type: videoType,
            video_url: videoURL,
            // videoHLSURL: videoURL,
            videoProcessingStatus: processingStatus,
            video_type: body.isPaid,
            validity: body.isPaid == 1 ? body.validity : null,
            paymentgateway_id: body.isPaid == 0 ? null : body.paymentGateWayId,
            iosPaymentGateWayid: body.isPaid == 1 ? body.iosPaymentGateWayid : null,
            video_amount: body.isPaid == 0 ? null : body.amount,
            video_preview: body.isPaid == 0 ? null : body.reviewText,
            update_ip: req.ip,
            status: body.status
        };

        if (body.currencyId) {

            video.currencyId = body.currencyId;
        }

        if (videoTransmissionId != '') {

            video.videoTransmissionId = videoTransmissionId;
        }

        if (body.duration != null) {

            video.video_duration = body.duration;
        }

        [err, video] = await to(coursesService.updateVideo(body.videoId, video));
        if (err) return ReE(res, err, 422);

        if (video.length == 1 && video[0] == 1) {

            [err, videoObj] = await to(coursesService.getVideo(req.user.account_id, body.videoId));
            var videoObj = videoObj.toJSON();

            if (body.streamURL != null, videoObj.type == 0) {

                videoObj.url = await GetSignUrl(videoObj.url);
            }


            return ReS(res, 'Video updated successfully.', videoObj);

        } else {

            return ReE(res, 'Failed to update Video, please try again.', 422);
        }
    }
}

// Get All Video File List
module.exports.getVideoList = async function (req, res) {

    [err, videoList] = await to(coursesService.getVideoList(req.user));
    if (err) return ReE(res, err, 422);


    if (videoList.length == 0) {

        return ReE(res, 'Video List Not Available', 204);

    } else {

        var videoSignedList = [];

        await Promise.all(videoList.map(async (video) => {

            var video = video.toJSON();
            if (video.type == 0) {

                video.url = await GetSignUrl(video.url);
                if (video.hlsURL) {
                    video.hlsURL = await GetSignUrl(video.hlsURL);
                }
            }

            videoSignedList.push(video)

        }));
        return ReS(res, 'All Video List Got Successfully.', videoSignedList);
    }
}

// Delete Video
module.exports.deleteVideo = async function (req, res) {
    const body = req.fields;

    if (!req.params.id) {

        return ReE(res, 'Video id missing.');

    } else {

        [err, videoObj] = await to(coursesService.getVideo(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);

        if(!videoObj){
            return ReE(res, 'No active video found with this id');
        }
        // delete mp4 video file
        if(videoObj && videoObj.toJSON().url){
            [err, result1] = await to(DeleteFromBucket(videoObj.toJSON().url));
            if (err) return ReE(res, err, 422);
        }

        // delete folder inside HLS Folder
        if (videoObj && videoObj.toJSON().hlsURL && videoObj.toJSON().hlsURL != '') {
            let array = videoObj.toJSON().hlsURL.split('/')
            array.pop();
            let deletePath = array.join('/');

            [err, result] = await to(DeleteFolderFromBucket(deletePath));
            if (err) return ReE(res, err, 422);

        }

        [err, isSuccess] = await to(coursesService.deleteVideo(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);

        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Video deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete video. please try again.');
        }
    }
}


module.exports.videoProcessingStatus = async function (req, res) {

    var body = req.fields;

    if (CONFIG.port == 3000) {

        body = JSON.parse(body.Message);
    }

    let transmissionId = body.jobId;
    [err, videoObj] = await to(coursesService.getVideoByTransmisionId(transmissionId));
    if (videoObj) {

        var videoObj = videoObj.toJSON();

        var video = { videoTransmissionId: transmissionId };
        if (body.state == 'PROGRESSING') {

            video.videoProcessingStatus = 1;

        } else if (body.state == 'COMPLETED') {


            video.videoProcessingStatus = 2;
            video.videoHLSURL = body.outputKeyPrefix + body.playlists[0].name + '.m3u8';

        } else if (body.state == 'ERROR') {

            video.videoProcessingStatus = 3;

        }


        [err, video] = await to(coursesService.updateVideo(videoObj.id, video));
        if (err) return ReE(res, err, 422);

        if (video.videoProcessingStatus == 2 || video.videoProcessingStatus == 3) {

            [err, user] = await to(authInstitute.getUser(videoObj.account_id));
            if (err) return ReE(res, err, 422);
            if (user && user.notificationToken) {
                [err, videoObj] = await to(coursesService.getVideo(videoObj.account_id, videoObj.id));
                if (videoObj) {

                    var videoObj = videoObj.toJSON();

                    if (videoObj.type == 0) {

                        videoObj.url = await GetSignUrl(videoObj.url);
                        if (videoObj.hlsURL) {
                            videoObj.hlsURL = await GetSignUrl(videoObj.hlsURL);
                        }
                    }

                    const payLoad = {
                        notification: {
                            title: video.videoProcessingStatus == 2 ? "Video Processing Completed" : "Failed to process your video please try again ",
                            body: (video.videoProcessingStatus == 2 ? "Processing Completed" : "Failed to process") + ' :- ' + videoObj.title,
                            click_action: CONFIG.port == 3000 ? 'https://tutor.example.com/video' : 'http://toa.learnonapp.in/video'
                        },
                        data: {
                            messageType: "VIDEOPROCESSINGSTATUS",
                            video: JSON.stringify(videoObj)
                        }
                    };
                    [err, message] = await to(SendNotification(user.notificationToken, payLoad));
                    // console.log(message);
                    // console.log(err);

                }
            }
        }

        return ReS(res, 'Response Get successfully.');

    } else {

        return ReE(res, 'Failed to find video.');
    }

}

// ---------------------------------------------- Video ---------------------------------------------- 