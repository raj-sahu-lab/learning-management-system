const forumDiscussionService = require('../../../services/V1/Student/Forum_Discussion.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');



// ============================ Forum Discussion ============================

module.exports.addForumDiscussionMessage = async function (req, res) {

    const body = req.fields;
    if(!body.articleId){

        return ReE(res, 'Article Id missing.', 422);

    } else if (!body.message){

        return ReE(res, 'Please enter message.', 422);

    } else {


        const messageJson = {
            student_id: req.user.id,
            article_id: body.articleId,
            message: body.message,
            create_ip: req.ip
        };

        [err, message] = await to(forumDiscussionService.addForumDiscussionMessage(messageJson));
        if (err) return ReE(res, err, 422);

        if (message) {

            [err, message] = await to(forumDiscussionService.getForumDiscussionMessage(message.id, body.articleId));
            if(message){

                let messageJson = message.toJSON();
                if(messageJson.student.image){
                    messageJson.student.image =  await GetSignUrl(messageJson.student.image);
                }
                
                return ReS(res, 'Message Saved Successfully.', messageJson);
            }

            return ReE(res, 'Failed to add message, please try again.', 422);

        } else {

            return ReE(res, 'Failed to add message, please try again.', 422);
        }

    }
}

module.exports.getForumDiscussionMessageList = async function (req, res) {
    
    const body = req.fields;
    const articleId = req.params.id;

    if(body.page == null){

        return ReE(res, 'Page missing.', 422);

    } else {

        var limit  = 10;
        if(body.limit){

            limit = body.limit;
        }

        [err, messageList] = await to(forumDiscussionService.getForumDiscussionMessageList(articleId , limit , body.page));
        if (err) return ReE(res, err, 422);

        if (messageList.length == 0) {

            return ReE(res, 'No message in this discussion', 204);

        } else {

            var messageSignedList = [];

            var mList = messageList.reverse();
            await Promise.all(mList.map(async (message) => {

                let messageJSON = message.toJSON();
                
                if(messageJSON.student.image){

                    messageJSON.student.image =  await GetSignUrl(messageJSON.student.image);
                }

                var messageReplaySignedList = [];

                if(messageJSON.reply.length > 0){

                    await Promise.all(messageJSON.reply.map(async (messageReply) => {

                        let messageReplyJSON = messageReply;
                        
                        if(messageReplyJSON.student.image){
        
                            messageReplyJSON.student.image =  await GetSignUrl(messageReplyJSON.student.image);
                        }
        
                        messageReplaySignedList.push(messageReplyJSON);
        
                    }));0
                    messageJSON.reply = messageReplaySignedList;
                }
               


                messageSignedList.push(messageJSON);

            }));

            return ReS(res, 'Message List Got Successfully.', messageSignedList);
        }
    }
}


module.exports.addForumDiscussionMessageReplay = async function (req, res) {

    const body = req.fields;
    if(!body.messageId){

        return ReE(res, 'Mesage Id missing.', 422);

    } else if(!body.articleId){

        return ReE(res, 'Article Id missing.', 422);

    } else if (!body.message){

        return ReE(res, 'Please enter message.', 422);

    } else {


        const messageReplayJson = {
            message_id: body.messageId,
            student_id: req.user.id,
            article_id: body.articleId,
            message: body.message,
            create_ip: req.ip
        };

        [err, messageReply] = await to(forumDiscussionService.addForumDiscussionMessageReply(messageReplayJson));
        if (err) return ReE(res, err, 422);

        if (messageReply) {

            [err, messageReply] = await to(forumDiscussionService.getForumDiscussionReplyMessage(messageReply.id, body.articleId));
            if(messageReply){

                let messageReplayJson = messageReply.toJSON();
                if(messageReplayJson.student.image){
                    messageReplayJson.student.image =  await GetSignUrl(messageReplayJson.student.image);
                }
                
                return ReS(res, 'Message Reply Saved Successfully.', messageReplayJson);
            }

            return ReE(res, 'Failed to add reply message, please try again.', 422);

        } else {

            return ReE(res, 'Failed to add reply message, please try again.', 422);
        }

    }
}
// ============================ Forum Discussion ============================

