const { TOA_forum_discussion , TOA_forum_discussion_reply,  TOA_student} = require('../../../models');
const { to, TE } = require('../util.service');


//AddForum Discussion Message
module.exports.addForumDiscussionMessage = async function (messageJson) {

    [err, message] = await to(TOA_forum_discussion.create(messageJson));
    if (err) TE(err.message);
    return message;

}

// Get Forum Discussion Message
module.exports.getForumDiscussionMessage = async function (messageId, articleId) {

    [err, message] = await to(TOA_forum_discussion.findOne({
        where: { id: messageId, article_id: articleId, delete: 0 },
        attributes: ['id', 'message', ['createdAt' , 'date']],
        include:[
            {
                model: TOA_student,
                as: 'student',
                attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
                
            }
        ]
    }));
    if (err) TE(err.message);
    return message;
}

// Get Forum Discussion Message List
module.exports.getForumDiscussionMessageList = async function (articleId , pageLimit , pageNo) {

    [err, messageList] = await to(TOA_forum_discussion.findAll({
        where: { article_id: articleId, delete: 0 },
        attributes: ['id', 'message', ['createdAt' , 'date']],
        order: [['createdAt', 'DESC']],
        limit: pageLimit,
        offset: (pageLimit * pageNo),
        include:[
            {
                model: TOA_student,
                as: 'student',
                attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
                
            },{
                model:TOA_forum_discussion_reply,
                as: 'reply',
                attributes: ['id', 'message_id','message', ['createdAt' , 'date']],
                required: false,
                include:[
                    {
                        model: TOA_student,
                        as: 'student',
                        attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
                        
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return messageList;

}

//Add Forum Discussion Message Reply
module.exports.addForumDiscussionMessageReply = async function (messageReplyJson) {

    [err, messageReply] = await to(TOA_forum_discussion_reply.create(messageReplyJson));
    if (err) TE(err.message);
    return messageReply;

}

// Get Forum Discussion Reply Message 
module.exports.getForumDiscussionReplyMessage = async function (messageId, articleId) {

    [err, messageReply] = await to(TOA_forum_discussion_reply.findOne({
        where: { id: messageId, article_id: articleId, delete: 0 },
        attributes: ['id', 'message', ['createdAt' , 'date']],
        include:[
            {
                model: TOA_student,
                as: 'student',
                attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
                
            }
        ]
    }));
    if (err) TE(err.message);
    return messageReply;
}