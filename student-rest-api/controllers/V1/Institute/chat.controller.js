const chatService = require('../../../services/V1/chat.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');

module.exports.getChatList = async function(req,res){

    if (req.user.userType == 3) {
        [err, chatData] = await to(chatService.getChatForTutor(req.user.id))
        if(err) return ReE(res, err, 422);

    } else {
        [err, chatData] = await to(chatService.getChatForInstitute(req.user.account_id))
        if(err) return ReE(res, err, 422);
    }
    
    return ReS(res, 'Chat List got successfully', chatData);

    // if (chatList) {}
}