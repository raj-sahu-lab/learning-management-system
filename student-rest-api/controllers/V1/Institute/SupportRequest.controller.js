const supportRequestService = require('../../../services/V1/Institute/SupportRequest.service');
const supportRequestServiceTutor = require('../../../services/V1/Tutor/SupportRequest.service');
const purchaseServiceStudent = require('../../../services/V1/Student/Purchase.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');
const { SendNotification } = require('../../../services/V1/notification.service');

// ===================== Support Request =====================

module.exports.getSupportRequestList = async function (req, res) {

    if (req.user.userType == 3) {

        [err, supportRequestList] = await to(supportRequestServiceTutor.getSupportRequestList(req.user.id));
        if (err) return ReE(res, err, 422);

        if (supportRequestList.length != 0) {

            var supportRequestRequest = []

            await Promise.all(supportRequestList.map(async (supportRequest) => {

                let supportRequestJson = supportRequest.toJSON();


                [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type, supportRequestJson.typeId));
                if (err) return ReE(res, err, 422);
                if (details) {

                    delete details.account;
                    delete details.validity;
                    supportRequestJson.detail = details;
                }

                [err, count] = await to(supportRequestService.supportUnreadCount(supportRequestJson.id));
                if (count) {
                    supportRequestJson.unreadCount = count;
                } else supportRequestJson.unreadCount = 0;

                supportRequestRequest.push(supportRequestJson)

            }));

            return ReS(res, 'Support ticket listed successfully.', supportRequestRequest);

        } else {

            return ReE(res, 'Empty Support ticket list..', 204);
        }

    } else {


        [err, supportRequestList] = await to(supportRequestService.getSupportRequestList(req.user));
        if (err) return ReE(res, err, 422);

        if (supportRequestList.length != 0) {

            var supportRequestRequest = []

            await Promise.all(supportRequestList.map(async (supportRequest) => {

                let supportRequestJson = supportRequest.toJSON();


                [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type, supportRequestJson.typeId));
                if (err) return ReE(res, err, 422);
                if (details) {

                    delete details.account;
                    delete details.validity;
                    supportRequestJson.detail = details;
                }

                [err, count] = await to(supportRequestService.supportUnreadCount(supportRequestJson.id));
                if (count) {
                    supportRequestJson.unreadCount = count;
                } else supportRequestJson.unreadCount = 0;

                supportRequestRequest.push(supportRequestJson)

            }));

            return ReS(res, 'Support ticket listed successfully.', supportRequestRequest);

        } else {

            return ReE(res, 'Empty Support ticket list..', 204);
        }

    }
}

module.exports.getSupportRequest = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Please select support request.', 422);

    } else {

        [err, supportRequest] = await to(supportRequestService.getSupportRequest(req.params.id));
        if (err) return ReE(res, err, 422);

        if (supportRequest) {

            let supportRequestJson = supportRequest.toJSON();


            [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type, supportRequestJson.typeId));
            if (err) return ReE(res, err, 422);
            if (details) {

                delete details.account;
                delete details.validity;
                supportRequestJson.detail = details;
            }


            return ReS(res, 'Support ticket get successfully.', supportRequestJson);

        } else {

            return ReE(res, 'Support ticket not found.', 204);
        }
    }
}

module.exports.closeSupportRequest = async function (req, res) {

    const supportRequestId = req.params.supportRequestId;
    let supportRequestJson = { currentStatus: 3 };

    [err, supportRequest] = await to(supportRequestService.updateSupportRequest(supportRequestId, supportRequestJson));
    if (err) return ReE(res, err, 422);

    if (supportRequest.length == 1 && supportRequest[0] == 1) {

        [err, supportRequest] = await to(supportRequestService.getSupportRequest(supportRequestId));
        if (err) return ReE(res, err, 422);

        if (supportRequest) {

            let supportRequestJson = supportRequest.toJSON();


            [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type, supportRequestJson.typeId));
            if (err) return ReE(res, err, 422);
            if (details) {

                delete details.account;
                delete details.validity;
                supportRequestJson.detail = details;
            }

            return ReS(res, 'Support Request closed successfully.', supportRequestJson);

        } else {

            return ReE(res, 'Failed to close support request, please try again.', 422);
        }
    } else {

        return ReE(res, 'Failed to close support request, please try again.', 422);
    }

}

module.exports.assignSupportRequestToTutor = async function (req, res) {

    const body = req.fields;

    if (!body.id) {

        return ReE(res, 'Please select support request.', 422);

    } else if (!body.authorityId) {

        return ReE(res, 'Please select authority.', 422);

    } else {

        let supportRequestJson = {
            currentStatus: 2,
            authorityId: body.authorityId,
            update_ip: req.ip
        };


        [err, supportRequest] = await to(supportRequestService.updateSupportRequest(body.id, supportRequestJson));
        if (err) return ReE(res, err, 422);

        if (supportRequest.length == 1 && supportRequest[0] == 1) {

            [err, supportRequest] = await to(supportRequestService.getSupportRequest(body.id));
            if (err) return ReE(res, err, 422);

            if (supportRequest) {

                let supportRequestJson = supportRequest.toJSON();

                [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type, supportRequestJson.typeId));
                if (err) return ReE(res, err, 422);
                if (details) {

                    delete details.account;
                    delete details.validity;
                    supportRequestJson.detail = details;
                }

                return ReS(res, 'Authority assigned successfully.', supportRequestJson);

            } else {

                return ReE(res, 'Failed to assign authority, please try again.', 422);
            }
        } else {

            return ReE(res, 'Failed to assign authority, please try again.', 422);
        }

    }
}

module.exports.deleteSupportRequest = async function (req, res) {

    const supportRequestId = req.params.supportRequestId;
    let supportRequestJson = { delete: 1 };

    [err, supportRequest] = await to(supportRequestService.getSupportRequest(supportRequestId));
    if (err) return ReE(res, err, 422);
    if (supportRequest) {

        [err, supportRequest] = await to(supportRequestService.updateSupportRequest(supportRequestId, supportRequestJson));
        if (err) return ReE(res, err, 422);

        if (supportRequest.length == 1 && supportRequest[0] == 1) {

            return ReS(res, 'Support Request deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete support request, please try again.', 422);
        }
    } else {

        return ReE(res, 'Support Request not found.', 422);
    }
}

module.exports.getTypeDetail = async function (type, typeId) {

    var details;
    if (type == 1) {

        [err, subject] = await to(purchaseServiceStudent.getSubject(typeId));
        if (err) return ReE(res, err, 422);
        if (subject)
            details = subject.toJSON();

    } else if (type == 2) {

        [err, topic] = await to(purchaseServiceStudent.getTopic(typeId));
        if (err) return ReE(res, err, 422);
        if (topic)
            details = topic.toJSON();

    } else if (type == 3) {

        [err, content] = await to(purchaseServiceStudent.getContent(typeId));
        if (err) return ReE(res, err, 422);
        if (content)
            details = content.toJSON();

    } else if (type == 6) {

        [err, pdf] = await to(purchaseServiceStudent.getPDF(typeId));
        if (err) return ReE(res, err, 422);
        if (pdf)
            details = pdf.toJSON();

    } else if (type == 7) {

        [err, ppt] = await to(purchaseServiceStudent.getPPT(typeId));
        if (err) return ReE(res, err, 422);
        if (ppt)
            details = ppt.toJSON();

    } else if (type == 8) {

        [err, audio] = await to(purchaseServiceStudent.getAudio(typeId));
        if (err) return ReE(res, err, 422);
        if (audio)
            details = audio.toJSON();

    } else if (type == 9) {

        [err, video] = await to(purchaseServiceStudent.getVideo(typeId));
        if (err) return ReE(res, err, 422);
        if (video)
            details = video.toJSON();
    }

    return details;
}

// ===================== Support Request =====================


// ===================== Support Request Chatting =====================
module.exports.addSupportRequestMessage = async function (req, res) {

    const body = req.fields;
    if (!body.ticketId) {

        return ReE(res, 'Ticket Id missing.', 422);

    } else if (!body.message) {

        return ReE(res, 'Please enter message.', 422);

    } else {

        if (req.user.userType == 3) {

            const messageJson = {
                authorityId: req.user.id,
                supportRequestId: body.ticketId,
                message: body.message,
                create_ip: req.ip
            };

            [err, message] = await to(supportRequestServiceTutor.addSupportRequestMessage(messageJson));
            if (err) return ReE(res, err, 422);

            if (message) {

                [err, message] = await to(supportRequestServiceTutorsupportRequestServiceTutorsupportRequestServiceTutorsupportRequestServiceTutor.getSupportRequestMessage(message.id, body.ticketId));

                if (message) {

                    let messageJson = message.toJSON();

                    if (messageJson.student && messageJson.student.image) {

                        messageJson.student.image = await GetSignUrl(messageJson.student.image);
                    }

                    if (messageJson.authority && messageJson.authority.image) {

                        messageJson.authority.image = await GetSignUrl(messageJson.authority.image);
                    }

                    if (messageJson.account && messageJson.account.image) {

                        messageJson.account.image = await GetSignUrl(messageJson.account.image);
                    }

                    return ReS(res, 'Message Saved Successfully.', messageJson);
                }

                return ReE(res, 'Failed to add message, please try again.', 422);

            } else {

                return ReE(res, 'Failed to add message, please try again.', 422);
            }

        } else {

            const messageJson = {
                accountId: req.user.account_id,
                supportRequestId: body.ticketId,
                message: body.message,
                create_ip: req.ip
            };

            [err, message] = await to(supportRequestService.addSupportRequestMessage(messageJson));
            if (err) return ReE(res, err, 422);

            if (message) {

                [err, message] = await to(supportRequestService.getSupportRequestMessage(message.id, body.ticketId));

                if (message) {

                    let messageJson = message.toJSON();

                    if (messageJson.student && messageJson.student.image) {

                        messageJson.student.image = await GetSignUrl(messageJson.student.image);
                    }

                    if (messageJson.authority && messageJson.authority.image) {

                        messageJson.authority.image = await GetSignUrl(messageJson.authority.image);
                    }

                    if (messageJson.account && messageJson.account.image) {

                        messageJson.account.image = await GetSignUrl(messageJson.account.image);

                    }

                    // Send Mobile Notification

                    if (messageJson.supportRequest.student && messageJson.supportRequest.student.androidDeviceToken) {

                        const notificationToken = messageJson.supportRequest.student.androidDeviceToken;
                        const bodyMessage = messageJson.account.name + " - " + messageJson.message;

                        let payLoad = {
                            data: {
                                title: "New Message Received ",
                                body: bodyMessage,
                                messageType: "SUPPORTREQUEST",
                                message: JSON.stringify(messageJson)
                            }
                        };

                        if (messageJson.supportRequest.student.deviceType == 2) {

                            payLoad = {
                                notification: {
                                    title: "New Message Received ",
                                    body: bodyMessage,
                                    messageType: "SUPPORTREQUEST",
                                    data: JSON.stringify(messageJson)
                                }
                            };
                        }

                        [err, message] = await to(SendNotification(notificationToken, payLoad));

                    }

                    // Send Web Notification
                    if (messageJson.supportRequest.student && messageJson.supportRequest.student.webDeviceToken) {

                        const webDeviceToken = messageJson.supportRequest.student.webDeviceToken;
                        const bodyMessage = messageJson.account.name + " - " + messageJson.message;

                        const payLoad = {
                            notification: {
                                title: "New Message Received ",
                                body: bodyMessage,
                                click_action: 'https://student.example.com/student/supportrequest'
                            },
                            data: {
                                messageType: "SUPPORTREQUEST",
                                message: JSON.stringify(messageJson)
                            }
                        };

                        [err, message] = await to(SendNotification(webDeviceToken, payLoad));

                    }

                    delete messageJson.supportRequest;

                    return ReS(res, 'Message Saved Successfully.', messageJson);
                }

                return ReE(res, 'Failed to add message, please try again.', 422);

            } else {

                return ReE(res, 'Failed to add message, please try again.', 422);
            }
        }
    }
}

module.exports.getSupportRequestMessageList = async function (req, res) {

    const body = req.fields;
    const ticketId = req.params.id;

    if (body.page == null) {

        return ReE(res, 'Page missing.', 422);

    } else {

        var limit = 10;
        if (body.limit) {

            limit = body.limit;
        }

        [err, messageList] = await to(supportRequestService.getSupportRequestMessageList(ticketId, limit, body.page));
        if (err) return ReE(res, err, 422);

        if (messageList.length == 0) {

            return ReE(res, 'No message in this discussion', 204);

        } else {

            var messageSignedList = [];

            var mList = messageList.reverse();

            for (const message of mList) {

                let messageJson = message.toJSON();

                if (messageJson.student && messageJson.student.image) {

                    messageJson.student.image = await GetSignUrl(messageJson.student.image);
                }

                if (messageJson.authority && messageJson.authority.image) {

                    messageJson.authority.image = await GetSignUrl(messageJson.authority.image);
                }

                if (messageJson.account && messageJson.account.image) {

                    messageJson.account.image = await GetSignUrl(messageJson.account.image);
                }

                messageSignedList.push(messageJson);
            }

            return ReS(res, 'Message List Got Successfully.', messageSignedList);
        }
    }
}




module.exports.deleteSupportRequestMessage = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Message id missing.');

    } else {

        [err, message] = await to(supportRequestService.deleteSupportRequestMessage(req.params.id));
        if (err) return ReE(res, err, 422);
        if (message.length === 1 && message[0] == 1) {

            return ReS(res, 'Message deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete message. please try again.');
        }
    }
}

module.exports.updateSupportRequestRead = async function (req, res) {

    const body = req.fields;
    if (body.ticketId) {
        [err, messageRead] = await to(supportRequestService.updateSupportRequestRead(body.ticketId));
        if (err) return ReE(res, err, 422);

        return ReS(res, 'Message Read status updated successfully.', messageRead);
    } else {
        return ReE(res, 'Support Request id missing', 422);
    }

}
// ===================== Support Request Chatting =====================
