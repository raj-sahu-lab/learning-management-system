const supportRequestService = require('../../../services/V1/Student/SupportRequest.service');
const purchaseServiceStudent = require('../../../services/V1/Student/Purchase.service');
const purchaseService = require('../../../services/V1/Institute/CourcePurchase.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');
const { SendNotification } = require('../../../services/V1/notification.service');
const { CountryContext } = require('twilio/lib/rest/pricing/v1/messaging/country');


// ===================== Support Request =====================

module.exports.addSupportRequest = async function (req, res) {

    const body = req.fields;

    if(!req.user.toJSON().branch){

        return ReE(res, 'Please select your institute first.', 422);

    }else if (!body.type) {

        return ReE(res, 'Please select cource type.', 422);

    } else if (!body.typeId) {

        return ReE(res, 'Please select cource subject.', 422);

    } else if (!body.name) {

        return ReE(res, 'Please enter topic name.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter topic description.', 422);

    } else {
        
        let supportRequestJson = body;
        
        supportRequestJson.branchId = req.user.toJSON().branch.id;
        supportRequestJson.studentId = req.user.toJSON().id;
        supportRequestJson.create_ip = req.ip;

        [err, supportRequest] = await to(supportRequestService.addSupportRequest(supportRequestJson));
        if (err) return ReE(res, err, 422);

        if(supportRequest){

            
            [err, supportRequest] = await to(supportRequestService.getSupportRequest(supportRequest.id));
            if (err) return ReE(res, err, 422);
            
            if(supportRequest){

                let supportRequestJson = supportRequest.toJSON();
                
                
                [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type ,supportRequestJson.typeId));
                if (err) return ReE(res, err, 422);
                if(details){
                    
                    delete details.account;
                    delete details.validity;
                    supportRequestJson.detail = details;
                }

                return ReS(res, 'Support ticket created successfully.', supportRequestJson);
            } else {

                return ReE(res, 'Failed to create support request, please try again.',422);
            }
        } else {

            return ReE(res, 'Failed to create support request, please try again.',422);
        }
    }
}

module.exports.getSupportRequest = async function (req, res) {

    const body = req.fields;

    if(!req.user.toJSON().branch){

        return ReE(res, 'Please select your institute first.', 422);

    } else if (!req.params.id) {

        return ReE(res, 'Please select support request.', 422);

    } else {
        
        [err, supportRequest] = await to(supportRequestService.getSupportRequest(req.params.id));
        if (err) return ReE(res, err, 422);

        if(supportRequest){

            let supportRequestJson = supportRequest.toJSON();
                
                
            [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type ,supportRequestJson.typeId));
            if (err) return ReE(res, err, 422);
            if(details){
                
                delete details.account;
                delete details.validity;
                supportRequestJson.detail = details;
            }

            return ReS(res, 'Support ticket successfully.', supportRequestJson);    

        } else {

            return ReE(res, 'Empty Support ticket list..',204);
        }
    }
}

module.exports.getSupportRequestList = async function (req, res) {

    const body = req.fields;

    if(!req.user.toJSON().branch){

        return ReE(res, 'Please select your institute first.', 422);

    } else {
        
        [err, supportRequestList] = await to(supportRequestService.getSupportRequestList(req.user.id, req.user.toJSON().branch.id));
        if (err) return ReE(res, err, 422);

        if(supportRequestList.length != 0){

            var supportRequestRequest = []

            await Promise.all(supportRequestList.map(async (supportRequest) => {

                let supportRequestJson = supportRequest.toJSON();
                
                
                [err, details] = await to(module.exports.getTypeDetail(supportRequestJson.type ,supportRequestJson.typeId));
                if (err) return ReE(res, err, 422);
                if(details){
                    
                    delete details.account;
                    delete details.validity;
                    supportRequestJson.detail = details;
                }

                [err, count] = await to(supportRequestService.supportUnreadCount(supportRequestJson.id));
                if(count){
                    supportRequestJson.unreadCount = count;
                } else supportRequestJson.unreadCount = 0;

                supportRequestRequest.push(supportRequestJson)

            }));

            return ReS(res, 'Support ticket listed successfully.', supportRequestRequest);    

        } else {

            return ReE(res, 'Empty Support ticket list..',204);
        }
    }
}


// ---------------------------------------------- Subject, Topic ,  Content , Test ---------------------------------------------- 
module.exports.getAllType = async function (req, res) {

    if(!req.user.toJSON().branch){

        return ReE(res, 'Please select your institute first.', 422);

    } else {
        
        [err, subjectList] = await to(purchaseService.getSubjectList(req.user.toJSON().branch.account.id));
        if (err) return ReE(res, err, 422);
    
        [err, topicList] = await to(purchaseService.getTopicList(req.user.toJSON().branch.account.id));
        if (err) return ReE(res, err, 422);
    
        [err, contentList] = await to(purchaseService.getContentList(req.user.toJSON().branch.account.id));
        if (err) return ReE(res, err, 422);
    
        [err, testList] = await to(purchaseService.getTestList(req.user.toJSON().branch.account.id));
        if (err) return ReE(res, err, 422);
    
        let responseJson = [
            {type: 1 ,title: 'Subject', list : subjectList},
            {type: 2 , title: 'Topic', list : topicList},
            {type: 3 , title: 'Content', list : contentList},
            {type: 4 , title: 'Test', list : testList}
        ];
        return ReS(res, 'All Data List Got Successfully.', responseJson);
    }
}
// ---------------------------------------------- Subject, Topic ,  Content , Test ---------------------------------------------- 


module.exports.getTypeDetail  = async function (type, typeId) {

    var details;
    if(type == 1){

    [err, subject] = await to(purchaseServiceStudent.getSubject(typeId));
        if (err) return ReE(res, err, 422);
        if(subject)
                details = subject.toJSON();
                    
    } else if(type == 2){

        [err, topic] = await to(purchaseServiceStudent.getTopic(typeId));
        if (err) return ReE(res, err, 422);
        if(topic)
            details = topic.toJSON();

    } else if(type == 3){

        [err, content] = await to(purchaseServiceStudent.getContent(typeId));
        if (err) return ReE(res, err, 422);
        if(content)
            details = content.toJSON();

    } else if(type == 6){

        [err, pdf] = await to(purchaseServiceStudent.getPDF(typeId));
        if (err) return ReE(res, err, 422);
        if(pdf)
            details = pdf.toJSON();
                    
    } else if(type == 7){

        [err, ppt] = await to(purchaseServiceStudent.getPPT(typeId));
        if (err) return ReE(res, err, 422);
        if(ppt)
            details = ppt.toJSON();

    } else if(type == 8){

        [err, audio] = await to(purchaseServiceStudent.getAudio(typeId));
        if (err) return ReE(res, err, 422);
        if(audio)
            details = audio.toJSON();
                    
    } else if(type == 9){

        [err, video] = await to(purchaseServiceStudent.getVideo(typeId));
        if (err) return ReE(res, err, 422);
        if(video)
            details = video.toJSON();
    } 

    return details;
}

// ===================== Support Request =====================

// ===================================================================================================================================================

// ===================== Support Request Chatting =====================
module.exports.addSupportRequestMessage = async function (req, res) {

    const body = req.fields;
    if(!body.ticketId){

        return ReE(res, 'Ticket Id missing.', 422);

    } else if (!body.message){

        return ReE(res, 'Please enter message.', 422);

    } else {
        
        const messageJson = {
            studentId: req.user.id,
            supportRequestId: body.ticketId,
            message: body.message,
            create_ip: req.ip
        };

        [err, message] = await to(supportRequestService.addSupportRequestMessage(messageJson));
        if (err) return ReE(res, err, 422);

        if (message) {

            [err, message] = await to(supportRequestService.getSupportRequestMessage(message.id, body.ticketId));
            
            if(message){

                let messageJson = message.toJSON();

                if(messageJson.student && messageJson.student.image){

                    messageJson.student.image =  await GetSignUrl(messageJson.student.image);
                }

                if(messageJson.authority && messageJson.authority.image){

                    messageJson.authority.image =  await GetSignUrl(messageJson.authority.image);
                }

                if(messageJson.account && messageJson.account.image){

                    messageJson.account.image =  await GetSignUrl(messageJson.account.image);
                }
                
                if(req.user.toJSON().branch.account.notificationToken){
                        
                    const notificationToken = req.user.toJSON().branch.account.notificationToken;

                    const bodyMessage = messageJson.student.first_name + " " + messageJson.student.last_name + " - " + messageJson.message;
                    
                    const payLoad = {
                        notification: {
                            title: "New Message Received",
                            body: bodyMessage,
                            click_action : 'https://tutor.example.com/supportChat/'+messageJson.ticketId
                        },
                        data: {
                            messageType: "SUPPORTREQUEST",
                            message: JSON.stringify(messageJson)
                        }
                    };

                    [err,message] = await to(SendNotification(notificationToken , payLoad));
                    
                }
                return ReS(res, 'Message Saved Successfully.', messageJson);
            }

            return ReE(res, 'Failed to add message, please try again.', 422);

        } else {

            return ReE(res, 'Failed to add message, please try again.', 422);
        }

    }
}

module.exports.getSupportRequestMessageList = async function (req, res) {
    
    const body = req.fields;
    const ticketId = req.params.id;

    if(body.page == null){

        return ReE(res, 'Page missing.', 422);

    } else {

        var limit  = 10;
        if(body.limit){

            limit = body.limit;
        }

        [err, messageList] = await to(supportRequestService.getSupportRequestMessageList(ticketId , limit , body.page));
        if (err) return ReE(res, err, 422);

        if (messageList.length == 0) {

            return ReE(res, 'No message in this discussion', 204);

        } else {
                        
            var messageSignedList = [];

            var mList = messageList.reverse();

            for (const message of mList) {

                let messageJson = message.toJSON();
                
                if(messageJson.student && messageJson.student.image){

                    messageJson.student.image =  await GetSignUrl(messageJson.student.image);
                }

                if(messageJson.authority && messageJson.authority.image){

                    messageJson.authority.image =  await GetSignUrl(messageJson.authority.image);
                }

                if(messageJson.account && messageJson.account.image){

                    messageJson.account.image =  await GetSignUrl(messageJson.account.image);
                }

                [err, count] = await to(supportRequestService.supportUnreadCount(ticketId));
                if(count){
                    messageJson.unreadCount = count;
                } else messageJson.unreadCount = 0;

                messageSignedList.push(messageJson);
            }
        
            return ReS(res, 'Message List Got Successfully.', messageSignedList);
        }
    }
}

module.exports.updateSupportRequestRead = async function (req, res) {
    
    const body = req.fields;
    if(body.ticketId){
        [err, messageRead] = await to(supportRequestService.updateSupportRequestRead(body.ticketId));
        if (err) return ReE(res, err, 422);

        return ReS(res, 'Message Read status updated successfully.', messageRead);
    } else {
        return ReE(res, 'Please pass ticket id', 422);
    }
    

}
// ===================== Support Request Chatting =====================