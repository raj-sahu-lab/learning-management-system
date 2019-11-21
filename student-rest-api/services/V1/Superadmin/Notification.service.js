const { TOA_tutor_notification } = require('../../../models');
const { to, TE } = require('../util.service');


module.exports.addNotifcation = async function (notificationInfo) {

    [err, notification] = await to(TOA_tutor_notification.create(notificationInfo));
    if (err) TE(err.message);
    return notification;
}