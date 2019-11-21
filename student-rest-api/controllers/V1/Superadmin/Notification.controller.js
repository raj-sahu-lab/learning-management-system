const notificationService = require('../../../services/V1/Superadmin/Notification.service');
const superAdminService = require('../../../services/V1/Superadmin/superadmin.service');
const { to, ReE, ReS , GetSignUrl , UploadImage } = require('../../../services/V1/util.service');
const { SendNotification } = require('../../../services/V1/notification.service');
const fs = require('fs');

module.exports.sendNotification = async function (req, res) {

    let body = req.fields;

    if (!body.accountId) {

        return ReE(res, 'Please Select Institute', 422);

    } else if (body.accountId.split(',').length == 0) {

        return ReE(res, 'Please Select Institute', 422);

    } else if(!body.title){

        return ReE(res, 'Please enter title', 422);
        
    } else if(!body.content){

        return ReE(res, 'Please enter content', 422);
    } else {


        
        var imageURL = null;
        
        if(req.files.image){
            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
            [err, s3Bucket] = await to(UploadImage('notification_images', name, imageBuffer));
            if (err) return ReE(res, 'Failed to send notification. please try gain.', 422);

            imageURL = s3Bucket.Key;
        }
        

        let accountIds = body.accountId.split(',');
        for (let index = 0; index < accountIds.length; index++) {
            const accountId = accountIds[index];
        
            let notificationInfo = {
            
                accountId: accountId,
                title: body.title,
                content: body.content,
                image_url: imageURL,
                link : body.link,
                create_ip: req.ip
            };

            var messageData = {
            
                title: body.title,
                content: body.content,
                image_url: await GetSignUrl(imageURL),
                link : body.link
            };

            [err, account] = await to (superAdminService.getAInstitute(accountId));
            if(account && account.notificationToken){

                var payLoad = {
                    notification: {
                        title: body.title,
                        body: body.content,
                        click_action: 'https://tutor.example.com/notifications',
                        
                    },
                    data: {
                        messageType: "ADMINNOTIFICATION",
                        message: JSON.stringify(messageData)
                    }
                };

                if(messageData.image_url){

                    payLoad.notification.image = messageData.image_url;
                }
                [err, message] = await to(SendNotification(account.notificationToken, payLoad));
                
            }

            [err, notification] = await to(notificationService.addNotifcation(notificationInfo));
        }

        return ReS(res, 'Notification send successfully.');

    }
}