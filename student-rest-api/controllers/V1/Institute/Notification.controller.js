const notificationService = require('../../../services/V1/Institute/Notification.service');
const authStudentService = require('../../../services/V1/Student/authentication.service');
const branachService = require('../../../services/V1/Institute/branch.service');
const { to, ReE, ReS, GetSignUrl, UploadImage } = require('../../../services/V1/util.service');
const { SendNotification } = require('../../../services/V1/notification.service');
const fs = require('fs');
const pluck = require('arr-pluck');

module.exports.sendNotification = async function (req, res) {

    let body = req.fields;

    if (!body.studentId && body.notificationType == 2) {

        return ReE(res, 'Please select student', 422);

    } else if (body.studentId && body.studentId.split(',').length == 0 && body.notificationType == 2) {

        return ReE(res, 'Please select student', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title', 422);

    } else if (!body.content) {

        return ReE(res, 'Please enter content', 422);
    } else {


        var imageURL = null;
        if (req.files.image) {

            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = (new Date().getTime().toString()) + '.png';
            [err, s3Bucket] = await to(UploadImage('notification_images_tutor', name, imageBuffer));
            if (err) return ReE(res, 'Failed to send notification. please try gain.', 422);
            imageURL = s3Bucket.Key;
        }


        var studentIdList = [];
        if (body.notificationType == 1) {

            var branchListIds = [];
            [err, branchList] = await to(branachService.getBranchList(req.user.account_id, 1));
            for (let index = 0; index < branchList.length; index++) {

                const branch = branchList[index].toJSON();
                branchListIds.push(branch.id);
            }

            [err, studentList] = await to(notificationService.getAllStudentList(branchListIds));
            studentIdList = pluck(studentList, 'id');
            // studentIdList = studentIdList.join(',');

        } else {

            studentIdList = body.studentId.split(',');
        }

        let messageJSON = {

            title: body.title,
            content: body.content,
            image_url: null,
            link: body.link
        };

        if (imageURL) {

            messageJSON.image_url = await GetSignUrl(imageURL);
        } else {
            messageJSON.image_url = null;
        }

        for (let index = 0; index < studentIdList.length; index++) {
            const studentId = studentIdList[index];

            let notificationInfo = {

                studentId: studentId,
                title: body.title,
                content: body.content,
                image_url: imageURL,
                link: body.link,
                create_ip: req.ip
            };


            [err, notification] = await to(notificationService.addNotifcation(notificationInfo));
            [err, student] = await to(authStudentService.getStudentNotificationToken(studentId));
            if (student) {

                if (student.androidDeviceToken) {

                    const notificationToken = student.androidDeviceToken;

                    let payLoad = {
                        data: {
                            title: body.title,
                            body: body.content,
                            messageType: "STUDENTGENERALNOTIFICATION",
                                message: JSON.stringify(messageJSON)
                        }
                    };

                    if (student.deviceType == 2) {

                        payLoad = {
                            notification: {
                                title: body.title,
                                body: body.content,
                            },
                            data: {
                                messageType: "STUDENTGENERALNOTIFICATION",
                                message: JSON.stringify(messageJSON)
                            }
                        };
                    }

                    [err, message] = await to(SendNotification(notificationToken, payLoad));
                    
                }

                // Send Web Notification
                if (student.webDeviceToken) {

                    const webDeviceToken = student.webDeviceToken;

                    var payLoad = {
                        notification: {
                            title: body.title,
                            body: body.content,
                            click_action: 'https://student.example.com/student/notifications'
                        },
                        data: {
                            messageType: "STUDENTGENERALNOTIFICATION",
                            message: JSON.stringify(messageJSON)
                        }
                    };

                    if(messageJSON.image_url){
                    
                        payLoad.notification.image = messageJSON.image_url;
                    }
                    [err, message] = await to(SendNotification(webDeviceToken, payLoad));

                }
            }


        }

        return ReS(res, 'Notification send successfully.');

    }
}

module.exports.getNotificationList = async function (req, res) {

    const accountId = req.user.account_id;

    [err, notificationList] = await to(notificationService.getAllNotifcation(accountId));
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