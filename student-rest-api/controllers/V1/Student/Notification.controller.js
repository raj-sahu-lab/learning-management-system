const notificationService = require('../../../services/V1/Student/Notification.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');


module.exports.getNotificationList = async function (req, res) {

    const studentId = req.user.id;

    [err, notificationList] = await to(notificationService.getAllNotifcation(studentId));
    if (err) return ReE(res, err, 422);


    if (notificationList.length == 0) {

        return ReE(res, 'No notifications.', 204);

    } else {

        var signedNotifications = [];
        for (let index = 0; index < notificationList.length; index++) {

            let notification = notificationList[index].toJSON();
            if (notification.image_url) {
                notification.image_url = await GetSignUrl(notification.image_url);
            }


            signedNotifications.push(notification);
        }

        return ReS(res, 'Notification List.', signedNotifications);
    }

}