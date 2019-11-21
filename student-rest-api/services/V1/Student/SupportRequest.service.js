const { TOA_support_request , TOA_student, TOA_support_request_chat ,TOA_tutor ,TOA_account} = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// ===================== Support Request  =====================
// Add New Support Request
module.exports.addSupportRequest = async function (supportRequestJson) {

    [err, supportRequest] = await to(TOA_support_request.create(supportRequestJson));
    if (err) TE(err.message);
    return supportRequest;
}


module.exports.getSupportRequest = async function (supportId) {

    
    [err, supportRequest] = await to(TOA_support_request.findOne({

        where: { id: supportId, delete: 0 },
        attributes: ['id','name' ,'description' , 'type',  'typeId', 'currentStatus', ['updatedAt', 'lastUpdated']],

    }))
    if (err) TE(err.message);
    return supportRequest;
}

module.exports.getSupportRequestList = async function (studentId , branchId) {

    
    [err, supportRequests] = await to(TOA_support_request.findAll({

        where: { studentId: studentId, branchId: branchId, delete: 0 },
        attributes: ['id','name' ,'description' , 'type',  'typeId', 'currentStatus', ['updatedAt', 'lastUpdated']],

    }))
    if (err) TE(err.message);

    return supportRequests;
}

module.exports.supportUnreadCount = async function (supportId) {

    [err, count] = await to(TOA_support_request_chat.count({
        where : {
            read : 0,
            supportRequestId : supportId,
            studentId : null
        }
    }));

    return count;
}
// ===================== Support Request  =====================

// ===================================================================================================================================================

// ===================== Support Request Chatting =====================

//Add Support Request Message
module.exports.addSupportRequestMessage = async function (messageJson) {

    // updating previous intitute message as read
    if(messageJson.supportRequestId){
        [err, chatRead] = await to(TOA_support_request_chat.update({read: 1}, { where: { studentId: null, supportRequestId: messageJson.supportRequestId } }));
    }

    // adding new message
    [err, message] = await to(TOA_support_request_chat.create(messageJson));
    if (err) TE(err.message);
    return message;

}

// Get Support Request Message
module.exports.getSupportRequestMessage = async function (messageId, supportRequestId) {

    [err, message] = await to(TOA_support_request_chat.findOne({
        where: { id: messageId, supportRequestId: supportRequestId, delete: 0 },
        attributes: ['id', ['supportRequestId' , 'ticketId'],'message', 'studentId', 'authorityId', ['createdAt' , 'date'], 'read'],
        include:[
            {
                model: TOA_student,
                as: 'student',
                attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
                required: false
            },
            {
                model: TOA_tutor,
                as: 'authority',
                attributes: [ ['tutor_id' , 'id'] , ['tutor_name' , 'name'] , ['tutor_image' , 'image']],
                required: false
            },
            {
                model: TOA_account,
                as: 'account',
                attributes: [ ['account_id' , 'id'] , ['account_title' , 'name'] , ['account_image' , 'image']],
                required: false
            }
        ]
    }));
    if (err) TE(err.message);
    return message;
}

// Get Support Request Message List
module.exports.getSupportRequestMessageList = async function (supportRequestId , pageLimit , pageNo) {
    
    [err, messageList] = await to(TOA_support_request_chat.findAll({

        where: { supportRequestId: supportRequestId, delete: 0 },
        attributes: ['id', ['supportRequestId' , 'ticketId'],'message', 'studentId', 'authorityId', ['createdAt' , 'date'], 'read'],
        order: [['createdAt', 'DESC']],
        limit: pageLimit,
        offset: ((pageNo - 1) * pageLimit),

        include:[
            {
                model: TOA_student,
                as: 'student',
                attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
                required: false
            },
            {
                model: TOA_tutor,
                as: 'authority',
                attributes: [ ['tutor_id' , 'id'] , ['tutor_name' , 'name'] , ['tutor_image' , 'image']],
                required: false
            },
            {
                model: TOA_account,
                as: 'account',
                attributes: [ ['account_id' , 'id'] , ['account_title' , 'name'] , ['account_image' , 'image']],
                required: false
            }
        ]
    }));
    if (err) TE(err.message);
    return messageList;

}

// Support request message read status
module.exports.updateSupportRequestRead = async function (supportRequestId) {
    
    [err, chatRead] = await to(TOA_support_request_chat.update({read: 1}, { where: { studentId: null, supportRequestId: supportRequestId } }));
    if (err) TE(err.message);
    return chatRead;

}

// ===================== Support Request Chatting =====================