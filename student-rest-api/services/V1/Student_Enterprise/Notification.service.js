const { TOA_student_notification } = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.getAllNotifcation = async function (studentId) {

    [err, notificationList] = await to(TOA_student_notification.findAll({

        where : {studentId : studentId},
        order: [['updatedAt', 'DESC']],
        attributes: ['id' , 'title' , 'content' ,'image_url' , 'link']
    }));
    if (err) TE(err.message);
    return notificationList;
}