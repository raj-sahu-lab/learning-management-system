const chatService = require('../services/V1/chat.service');

module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.on('join', function (data) {

      if(data.studentId && data.tutorId){
        let room = 's'+data.studentId+'t'+data.tutorId;

        if(data.type && data.oldRoom){
          chatService.updateRead(data.type, data.oldRoom);
          socket.leave(data.oldRoom);
        }

        socket.join(room);

        if(data.type){
          chatService.updateRead(data.type, room);
        }

        chatService.chatList(room).then(chatlist=>{
          io.to(room).emit('joinData', chatlist);
        });
        
      }

    });

    socket.on('message', function (data) {
      let room = 's'+data.studentId+'t'+data.tutorId;

      if(data.studentId && data.tutorId && data.type && data.message && data.accountId){
        const chatJson = {
          student_id: data.studentId,
          tutor_id: data.tutorId,
          type: data.type,
          chatRoom: room,
          message: data.message,
          account_id: data.accountId
        };
        
        chatService.addChat(chatJson).then(data=>{
          io.to(room).emit('message', data);
        });
      }
      
    });

    socket.on('leave', function (data){

      if(data.chatRoom && data.type){

        chatService.updateRead(data.type, data.chatRoom);
      }

      if(data != null && data.chatRoom != null){

        socket.leave(chatRoom);
      }
    });

  });
}