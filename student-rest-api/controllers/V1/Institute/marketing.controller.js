const marketingService = require('../../../services/V1/Institute/marketing.service');
const { GetSignUrl, UploadEmailFiles, to, ReE, ReS, GetFolderInSIB, SendEmailCampaign, GetCampaignReport, CreateSNSTopic, AddSubscriberToSNSTopic, SendSMSToSNSTopic } = require('../../../services/V1/util.service');

const request = require('request');
var chargebee = require("chargebee");
const fs = require('fs');


// Add Send SMS to learner
module.exports.sendSMSTOLearner = async function (req, res) {

    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter learner name.', 422);

    } else if (!body.description) {

        return ReE(res, 'Please enter learner phone number.', 422);

    } else if (body.numbers == null) {

        return ReE(res, 'Please enter learner numbers.', 422);

    } else if (body.numbers.length == 0) {

        return ReE(res, 'Please enter learner numbers.', 422);

    } else {


        var smsLength = 1;
        if (body.description.length > 153) {
            smsLength = Math.round(body.description.length / 153);
        }
        var sms = {
            account_id: req.user.account_id,
            subject: body.title,
            message: body.description,
            sms_length: smsLength,
            sent_contacts: body.numbers.join(),
            create_ip: req.ip
        };


        [err, sms] = await to(marketingService.addSMS(sms));
        if (err) return ReE(res, err, 422);

        if (sms) {

            // let url = encodeURI('http://sms.example.com/api/sendmsg.php?user=company&pass=[PASSWORD]&sender=SICPL1&phone=' + body.numbers.join() + '&text='+ body.description +'&priority=ndnd&stype=normal');

            // if(body.smsType == 'dnd'){

            //     url = encodeURI('http://tsms.example.com/api/sendmsg.php?user=companyt&pass=[PASSWORD]&sender=SICPL1&phone=' + body.numbers.join() + '&text='+ body.description +'&priority=dnd&stype=normal');

            // }
            // request(url, function (error, response, body) {

            //     if (response && response.statusCode && response.statusCode == 200) {

            //         return ReS(res, 'SMS sent successfully.');

            //     } else {

            //         return ReE(res, 'Failed to add SMS, please try again.', 422);

            //     }
            // });


            let topicName = req.user.account_id + '_' + sms.id + '_' + body.title.split(' ').join('_');
            [err, topicName] = await to(CreateSNSTopic(topicName));
            if (err) return ReE(res, 'Failed to add SMS, please try again.', 422);

            if (topicName) {

                await Promise.all(body.numbers.map(async (number) => {

                    [err, contact] = await to(AddSubscriberToSNSTopic(topicName.TopicArn, number));

                }));


                [err, sendMessage] = await to(SendSMSToSNSTopic(topicName.TopicArn, body.description));
                if (err) return ReE(res, 'Failed to add SMS, please try again.', 422);
                return ReS(res, 'SMS sent successfully.');
            } else {

                return ReE(res, 'Failed to add SMS, please try again.', 422);
            }
        } else {

            return ReE(res, 'Failed to send SMS, please try again.', 422);
        }
    }
}


// Add Send Email to learner
module.exports.createCampaignForStudent = async function (req, res) {

    const body = req.fields;
    body.emailIdS = [body.emailIdS];

    if (!body.title) {

        return ReE(res, 'Please enter campain title.', 422);

    } else if (!body.subject) {

        return ReE(res, 'Please enter mail subject.', 422);

    } else if (!body.mailContent) {

        return ReE(res, 'Please enter mail content.', 422);

    } else if (body.emailIdS == null) {

        return ReE(res, 'Please select learner emails.', 422);

    } else if (body.emailIdS.length == 0) {

        return ReE(res, 'Please select learner emails.', 422);

    } else {

        if (JSON.stringify(req.files) != '{}') {

            var fileBuffer = fs.readFileSync(req.files.attachmentUrl.path);

            var name = (new Date().getTime().toString()) + '_' + req.files.attachmentUrl.name;

            [err, s3Bucket] = await to(UploadEmailFiles(req.user.account_id, name, fileBuffer));
            if (err) return ReE(res, err, 422);

            body.attachmentUrl = s3Bucket.Location;

        }

        var campaign = {
            title: body.title,
            email: req.user.account_email,
            listIds: body.emailIdS,
            content: body.mailContent,
            subject: body.subject,
        };

        if (Object.keys(req.files).length != 0) {
            campaign.attachmentUrl = body.attachmentUrl;
        }

        [err, result] = await to(SendEmailCampaign(req.user.sib_folder_id, campaign));

        if (err) return ReE(res, err, 422);


        if (result) {

            const campaignJson = {
                account_id: req.user.account_id,
                campaign_id: result,
                title: body.title,
                subject: body.subject,
                content: body.mailContent,
                sent_emails: body.emailIdS.join(','),
                attachmentUrl: body.attachmentUrl,
                create_ip: req.ip
            };


            [err, campaignResult] = await to(marketingService.addCampaignEmail(campaignJson));
            if (err) return ReE(res, err, 422);

            [err, campaignResult] = await to(marketingService.getCampaign(req.user.account_id, campaignResult.id));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'Email sent successfully.', campaignResult);

        } else {

            return ReE(res, 'Failed to create campaign, please try again.', 422);
        }
    }
}


module.exports.getAllCampaignList = async function (req, res) {

    [err, campaignResult] = await to(marketingService.getAllCampaignList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (campaignResult.length == 0) {

        return ReE(res, 'Campaign List Get Successfully.', 204);

    } else {

        return ReS(res, 'Campaign List Get Successfully.', campaignResult);
    }
}

module.exports.getCampaignReport = async function (req, res) {

    const campaignId = req.params.id;
    [err, campaignResult] = await to(GetCampaignReport(campaignId));
    if (err) return ReE(res, err, 422);
    return ReS(res, 'Campaign Report Get Successfully.', campaignResult);

}





module.exports.chargebeePaymentTest = async function (req, res) {

    chargebee.configure({
        site: "naymio-test",
        api_key: "YOUR_CHARGEBEE_API_KEY"
    })

    chargebee.payment_source.create_card({
        customer_id: "6olzBSSfLawavF9",
        card: {
            number: "5105105105105100",
            cvv: "123",
            expiry_year: 2023,
            expiry_month: 03
        }
    }).request(function (error, result) {
        if (error) {
            //handle error
            console.log(error);
        } else {
            // console.log(result);
            var customer = result.customer;
            var payment_source = result.payment_source;
            return ReS(res, 'Subscription Report Get Successfully.', result);
        }
    });


}