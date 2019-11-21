const { TOA_tutor, TOA_chat , TOA_student, TOA_account} = require('../../models');
const { to, TE, GetSignUrl } = require('./util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.chatList = async function (room) {

    [err, chatList] = await to(TOA_chat.findAll({
        where : {chatRoom: room, delete: 0},
        attributes: ['id', 'type', 'chatRoom', 'message', 'read', 'createdAt'],
        order: [['id', 'ASC']],
        require: false,
        include : [
          {
            model: TOA_student,
            as: 'student',
            attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
            
          },
          {
            model: TOA_tutor,
            as: 'tutor',
            attributes: [ ['tutor_id','id'] ,['tutor_name','name'] , ['tutor_image','image']],
          },
          {
            model: TOA_account,
            as: 'account',
            attributes: [ ['account_id','id'] ,['account_title','name'], ['account_image', 'image']],
          }
        ]
    }));
    if (err) TE(err.message);

    var chatLists = [];

    await Promise.all(chatList.map(async (chat) => {
        let chatJson = chat.toJSON();
        if(chatJson.student && chatJson.student.image){
            chatJson.student.image = await GetSignUrl(chatJson.student.image);
        }
        if(chatJson.tutor && chatJson.tutor.image){
            chatJson.tutor.image = await GetSignUrl(chatJson.tutor.image);
        }
        if(chatJson.account && chatJson.account.image){
            chatJson.account.image = await GetSignUrl(chatJson.account.image);
        }
        chatLists.push(chatJson);
    }));

    return chatLists;
}

// store chat
module.exports.addChat = async function (chatData) {

    [err, message] = await to(TOA_chat.create(chatData));
    if (err) TE(err.message);

    [err, currentMessage] = await to(TOA_chat.findOne({
        where : {id: message.id, delete: 0},
        attributes: ['id', 'type', 'chatRoom', 'message', 'read', 'createdAt'],
        require: false,
        include : [
          {
            model: TOA_student,
            as: 'student',
            attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
            
          },
          {
            model: TOA_tutor,
            as: 'tutor',
            attributes: [ ['tutor_id','id'] ,['tutor_name','name'] , ['tutor_image','image']],
          },
          {
            model: TOA_account,
            as: 'account',
            attributes: [ ['account_id','id'] ,['account_title','name'], ['account_image', 'image']],
          }
        ]
    }));
    if (err) TE(err.message);

    let chatJson = currentMessage.toJSON();
    if(chatJson.student && chatJson.student.image){
        chatJson.student.image = await GetSignUrl(chatJson.student.image);
    }
    if(chatJson.tutor && chatJson.tutor.image){
        chatJson.tutor.image = await GetSignUrl(chatJson.tutor.image);
    }
    if(chatJson.account && chatJson.account.image){
        chatJson.account.image = await GetSignUrl(chatJson.account.image);
    }
    return chatJson;

}

// chat list for institute login
module.exports.getChatForInstitute = async function (accountId) {

    [err, chatList] = await to(TOA_chat.findAll({
        where : {
            account_id: accountId,
            delete: 0,
            student_id: {
                [Op.ne] : null,
            }
        },
        attributes: ['id', 'chatRoom'],
        require: false,
        include : [
          {
            model: TOA_student,
            as: 'student',
            attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
            
          }
        ],
        group : ['chatRoom']

    }));
    if (err) TE(err.message);

    var chatLists = [];

    await Promise.all(chatList.map(async (chat) => {
        let chatJson = chat.toJSON();
        [err, count] = await to(TOA_chat.count({
          where : {
            read : 0,
            student_id : chatJson.student.id,
            chatRoom : chatJson.chatRoom,
            type : 'student'
          }
        }));
        chatJson.unRead = count;
        if(chatJson.student && chatJson.student.image){
            chatJson.student.image = await GetSignUrl(chatJson.student.image);
        }
        chatLists.push(chatJson);
    }));

    return chatLists;
}

// chat list for tutor login
module.exports.getChatForTutor = async function (tutorId) {

    [err, chatList] = await to(TOA_chat.findAll({
        where : { 
            delete: 0,
            chatRoom: {
                [Op.like] : '%t'+tutorId,
            },
            student_id: {
                [Op.ne] : null,
            }
        },
        attributes: ['id', 'chatRoom'],
        require: false,
        include : [
          {
            model: TOA_student,
            as: 'student',
            attributes: [ 'id' ,'first_name' , 'last_name' , 'image'],
            
          }
        ],
        group : ['chatRoom']

    }));
    if (err) TE(err.message);

    var chatLists = [];

    await Promise.all(chatList.map(async (chat) => {
        let chatJson = chat.toJSON();
        [err, count] = await to(TOA_chat.count({
          where : {
            read : 0,
            student_id : chatJson.student.id,
            chatRoom : chatJson.chatRoom,
            type : 'student'
          }
        }));
        chatJson.unRead = count;
        if(chatJson.student && chatJson.student.image){
            chatJson.student.image = await GetSignUrl(chatJson.student.image);
        }
        chatLists.push(chatJson);
    }));

    return chatLists;
}

// update read status
module.exports.updateRead = async function(type, chatRoom){
  if(type == 'student'){
    [err, chat] = await to(TOA_chat.update({read: 1}, { where: { [Op.or]: [{type: 'institute'}, {type: 'tutor'}], chatRoom: chatRoom } }));
    if (err) TE(err.message);
    return chat;
  }
  if(type == 'institute' || type == 'tutor'){
    [err, chat] = await to(TOA_chat.update({read: 1}, { where: { type: 'student', chatRoom: chatRoom } }));
    if (err) TE(err.message);
    return chat;
  }
  if (err) TE('type not found');

}
