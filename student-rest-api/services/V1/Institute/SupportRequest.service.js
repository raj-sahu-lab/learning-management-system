const { TOA_support_request , TOA_branch , TOA_student, TOA_tutor ,TOA_support_request_chat, TOA_account } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// ===================== Support Request =====================

// Get Support Request List
module.exports.getSupportRequestList = async function (user) {

    [err, supportRequest] = await to(TOA_support_request.findAll({

        where: { delete: 0 },
        attributes: ['id','name' ,'description' , 'type',  'typeId', 'currentStatus', 'authorityId',['updatedAt', 'lastUpdated']],
        include:[
            {
                model: TOA_branch,
                as: 'branch',
                where: { account_id: user.account_id ,  delete: 0 , status: 0},
                attributes: [['branch_id' , 'id'] , ['branch_manager' ,'manager'] , ['branch_name' , 'name'] ,'contactCountryCode' , ['branch_number', 'number']]
            },
            {
                model: TOA_student,
                as: 'student',
                where: {  delete: 0 , status: 0},
                attributes: ['id' , ['first_name' ,'firstName'] , ['last_name' , 'lastLame'] ,'countrycode' , 'phone', 'email']
            },
            {
                model: TOA_tutor,
                as: 'authority',
                where: {  delete: 0 , status: 0},
                attributes: [['tutor_id' , 'id'], ['tutor_name' , 'name'] ,'countryCode' , ['tutor_phone', 'phone'], ['tutor_email' ,'email']],
                required: false
            }
        ]


    }))
    if (err) TE(err.message);
    return supportRequest;
}

module.exports.supportUnreadCount = async function (supportId) {

    [err, count] = await to(TOA_support_request_chat.count({
        where : {
            read : 0,
            supportRequestId : supportId,
            studentId : {[Op.not]: null}
        }
    }));

    return count;
}

// Get Support Request
module.exports.getSupportRequest = async function (ticketId) {

    
    [err, supportRequest] = await to(TOA_support_request.findOne({

        where: { id: ticketId, delete: 0 },
        attributes: ['id','name' ,'description' , 'type',  'typeId', 'currentStatus', 'authorityId',['updatedAt', 'lastUpdated']],
        include:[
            {
                model: TOA_branch,
                as: 'branch',
                where: {  delete: 0 , status: 0},
                attributes: [['branch_id' , 'id'] , ['branch_manager' ,'manager'] , ['branch_name' , 'name'] ,'contactCountryCode' , ['branch_number', 'number']]
            },
            {
                model: TOA_student,
                as: 'student',
                where: {  delete: 0 , status: 0},
                attributes: ['id' , ['first_name' ,'firstName'] , ['last_name' , 'lastLame'] ,'countrycode' , 'phone', 'email']
            },
            {
                model: TOA_tutor,
                as: 'authority',
                where: {  delete: 0 , status: 0},
                attributes: [['tutor_id' , 'id'], ['tutor_name' , 'name'] ,'countryCode' , ['tutor_phone', 'phone'], ['tutor_email' ,'email']],
                required: false
            }
        ]


    }))
    if (err) TE(err.message);
    return supportRequest;
}

// Get Support Request
module.exports.getSupportRequest = async function (id) {

    
    [err, supportRequest] = await to(TOA_support_request.findOne({

        where: { id: id , delete: 0 },
        attributes: ['id','name' ,'description' , 'type',  'typeId', 'currentStatus', ['updatedAt', 'lastUpdated']],
        include:[
            {
                model: TOA_branch,
                as: 'branch',
                where: {  delete: 0 , status: 0},
                attributes: [['branch_id' , 'id'] , ['branch_manager' ,'manager'] , ['branch_name' , 'name'] ,'contactCountryCode' , ['branch_number', 'number']]
            }
        ]


    }))
    if (err) TE(err.message);
    return supportRequest;
}

// Update Support Request
module.exports.updateSupportRequest = async function (id, supportRequestJson) {

    [err, supportRequest] = await to(TOA_support_request.update(supportRequestJson, { where: { id: id } }));
    if (err) TE(err.message);
    return supportRequest;
}

// ===================== Support Request =====================

// ===================== Support Request Chatting =====================

//Add Support Request Message
module.exports.addSupportRequestMessage = async function (messageJson) {

    [err, message] = await to(TOA_support_request_chat.create(messageJson));
    if (err) TE(err.message);
    return message;

}

// Get Support Request Message
module.exports.getSupportRequestMessage = async function (messageId, supportRequestId) {

    [err, message] = await to(TOA_support_request_chat.findOne({
        where: { id: messageId, supportRequestId: supportRequestId, delete: 0 },
        attributes: ['id',['supportRequestId' , 'ticketId'], 'message', 'studentId', 'authorityId', ['createdAt' , 'date'], 'read'],
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
            },
            {
                model: TOA_support_request,
                as: 'supportRequest',
                attributes: ['studentId'],
                include:[
                    {
                        model: TOA_student,
                        as: 'student',
                        attributes: [ 'deviceType', 'androidDeviceToken' , 'webDeviceToken']
                    }
                ],
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

// Delete Support Request Message
module.exports.deleteSupportRequestMessage = async function (messageId) {

    const messageJson = {delete: 1};
    
    [err, message] = await to(TOA_support_request_chat.update(messageJson, { where: { id: messageId } }));
    if (err) TE(err.message);
    return message;

}

// Support request message read status
module.exports.updateSupportRequestRead = async function (supportRequestId) {
    
    [err, chatRead] = await to(TOA_support_request_chat.update({read: 1}, { where: { studentId: {[Op.not]: null}, supportRequestId: supportRequestId } }));
    if (err) TE(err.message);
    return chatRead;

}

// ===================== Support Request Chatting =====================