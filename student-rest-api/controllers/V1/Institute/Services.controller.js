const { to, ReE, ReS } = require('../../../services/V1/util.service');
const smsService = require('../../../services/V1/Superadmin/sms.service');
const emailService = require('../../../services/V1/Superadmin/email.service');
const servicesService = require('../../../services/V1/Institute/Services.service');

module.exports.buySMSCredit = async function (req, res) {

    let body = req.fields;
    const accountId = req.user.account_id;

    if (!body.transactionId) {

        return ReE(res, 'Transaction id missing', 422);

    } else if (!body.totalSMS) {

        return ReE(res, 'Please Enter no. of sms.', 422);

    } else {

        let smsInfo = {
            
            account_id: 1,
            institute_id: accountId,
            total_sms: body.totalSMS,
            transactionId: body.transactionId,
            create_ip: req.ip
        };

        [err, sms] = await to(smsService.addSMSToInstitute(smsInfo));
        if (err) return ReE(res, err, 422);

        if(sms){
            
            return ReS(res, 'SMS Credeited Successfully.');

        } else {

            return ReE(res, 'Failed to add SMS. please try again.', 422);

        }
    }
}


module.exports.buyEmailCredit = async function (req, res) {

    let body = req.fields;
    const accountId = req.user.account_id;
    if (!body.transactionId) {

        return ReE(res, 'Transaction id missing', 422);

    } else if (!body.totalEmail) {

        return ReE(res, 'Please Enter no. of email.', 422);

    } else {

        let emailInfo = {
            
            account_id: 1,
            institute_id: accountId,
            total_email: body.totalEmail,
            transactionId: body.transactionId,
            create_ip: req.ip
        };

        [err, email] = await to(emailService.addEmailToInstitute(emailInfo));
        if (err) return ReE(res, err, 422);

        if(email){
        
            return ReS(res, 'Email Credited Successfully.');

        } else {

            return ReE(res, 'Failed to add Email. please try again.', 422);

        }
    }
}


module.exports.getSMSEmailPlans = async function (req, res) {

    const type = req.params.type ? req.params.type : 1;

    [err, smsPlanList] = await to(servicesService.getSMSPlanList(type));
    if (err) return ReE(res, err, 422);

    if (smsPlanList.length == 0) {

        return ReE(res, 'SMS/Email Plan lsit are not available', 204);

    } else {

        return ReS(res, 'All SMS/Email Plan List Got Successfully.', smsPlanList);
    }
}