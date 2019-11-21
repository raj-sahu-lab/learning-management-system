const { TOA_support_request , TOA_branch , TOA_student, TOA_support_request_chat ,TOA_tutor , TOA_account } = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.getSupportRequestList = async function (authorityId) {

    
    [err, supportRequest] = await to(TOA_support_request.findAll({

        where: { authorityId : authorityId, delete: 0 },
        attributes: ['id','name' ,'description' , 'type',  'typeId', 'currentStatus', 'authorityId',['updatedAt', 'lastUpdated']],
        include:[
            {
                model: TOA_branch,
                as: 'branch',
                where: { delete: 0 , status: 0},
                attributes: [['branch_id' , 'id'] , ['branch_manager' ,'manager'] , ['branch_name' , 'name'] ,'contactCountryCode' , ['branch_number', 'number']]
            },
            {
                model: TOA_student,
                as: 'student',
                where: {  delete: 0 , status: 0},
                attributes: ['id' , ['first_name' ,'firstName'] , ['last_name' , 'lastLame'] ,'countrycode' , 'phone', 'email']
            }
        ]


    }))
    if (err) TE(err.message);
    return supportRequest;
}

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

// Add New Support Request
module.exports.updateSupportRequest = async function (id, supportRequestJson) {

    [err, supportRequest] = await to(TOA_support_request.update(supportRequestJson, { where: { id: id } }));
    if (err) TE(err.message);
    return supportRequest;
}

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
        attributes: ['id', 'message', 'studentId', 'authorityId', ['createdAt' , 'date']],
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
        attributes: ['id', 'message', 'studentId', 'authorityId', ['createdAt' , 'date']],
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

// ===================== Support Request Chatting =====================