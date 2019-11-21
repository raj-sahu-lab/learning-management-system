const { TOA_tutor_notification, TOA_student_notification , TOA_student } = require('../../../models');
const { to, TE } = require('../util.service');


module.exports.addNotifcation = async function (notificationInfo) {

    [err, notification] = await to(TOA_student_notification.create(notificationInfo));
    if (err) TE(err.message);
    return notification;
}


module.exports.getAllNotifcation = async function (accountId) {

    [err, notificationList] = await to(TOA_tutor_notification.findAll({

        where : {accountId : accountId},
        order: [['updatedAt', 'DESC']],
        attributes: ['id' , 'title' , 'content' ,'image_url' , 'link']
    }));
    if (err) TE(err.message);
    return notificationList;
}

module.exports.getAllStudentList = async function (branchId) {

    [err, studentList] = await to(TOA_student.findAll({

        where : { defaultBranch : branchId},
        attributes: ['id']
    }));
    if (err) TE(err.message);
    return studentList;
}