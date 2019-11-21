const { to, ReE, ReS } = require('../../../services/V1/util.service');
const smsService = require('../../../services/V1/Superadmin/sms.service');
const CONFIG = require('../../../config/config');

module.exports.addSMSCredit = async function (req, res) {

    let body = req.fields;

    if (!body.accountId) {

        return ReE(res, 'Please Select Institute', 422);

    } else if (!body.totalSMS) {

        return ReE(res, 'Please Enter no. of sms.', 422);

    } else {

        let smsInfo = {
            
            account_id: req.user.id,
            institute_id: body.accountId,
            total_sms: body.totalSMS,
            create_ip: req.ip
        };

        [err, sms] = await to(smsService.addSMSToInstitute(smsInfo));
        if (err) return ReE(res, err, 422);

        if(sms){
            
            [err, smsStatus] = await to(smsService.getInstituteRemainSMSStatus(body.accountId));
            return ReS(res, 'SMS Credeited Successfully.',smsStatus);

        } else {

            return ReE(res, 'Failed to add SMS. please try again.', 422);

        }
    }
}

module.exports.getAllSMSCreditList = async function (req, res) {

    if(req.params.id){

        [err, smsSentStatus] = await to(smsService.getInstituteSMSList(req.params.id));
        if (err) return ReE(res, err, 422);
        if(smsSentStatus.length == 0){

            return ReE(res, 'All Institute SMS List Get Successfully.', 204);
        }
        else{
            return ReS(res, 'All Institute SMS List Get Successfully.',smsSentStatus);
        }

    } else {
    
        [err, smsSentStatus] = await to(smsService.getAllInstituteRemainSMSStatus());
        if (err) return ReE(res, err, 422);

        if(smsSentStatus.length == 0){

            return ReE(res, 'All Institute SMS Get Successfully.', 204);
        }
        else{
            return ReS(res, 'All Institute SMS Get Successfully.',smsSentStatus);
        }
    }
    
}


// SMS/Email Plans
module.exports.addSMSPlan = async function (req, res) {

    const body = req.fields;

    if (!body.countryId) {

        return ReE(res, 'Please select country code.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if(body.planType == null){

        return ReE(res, 'Please select plan type.', 422);

    } else if(body.totalCount == null){

        return ReE(res, 'Please enter no. of sms or emails.', 422);

    } else if(!body.amount){

        return ReE(res, 'Please enter amount.', 422);

    } else if(!body.amountUSD){

        return ReE(res, 'Please enter amount in USD.', 422);

    } else {


        let planJSON = body;
        planJSON.create_ip = req.ip;

        [err, smsPlan] = await to(smsService.addSMSPlan(planJSON));
        if (err) return ReE(res, err, 422);

        if (smsPlan) {

            [err, smsPlanJSON] = await to(smsService.getSMSPlan(smsPlan.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'SMS/Email Plan added successfully.', smsPlanJSON);

        } else {

            return ReE(res, 'Failed to add plan, please try again.', 422);
        }
    }
}

module.exports.getSMSPlanList = async function (req, res) {

    [err, smsPlanList] = await to(smsService.getSMSPlanList());
    if (err) return ReE(res, err, 422);

    if (smsPlanList.length == 0) {

        return ReE(res, 'SMS/Email Plan lsit are not available', 204);

    } else {

        return ReS(res, 'All SMS/Email Plan List Got Successfully.', smsPlanList);
    }


}

module.exports.updateSMSPlan = async function (req, res) {

    const body = req.fields;
    if (!body.planId) {

        return ReE(res, 'Please enter education id.', 422);

    } else if (!body.countryId) {

        return ReE(res, 'Please select country code.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if(body.planType == null){

        return ReE(res, 'Please select plan type.', 422);

    } else if(body.totalCount == null){

        return ReE(res, 'Please enter no. of sms or emails.', 422);

    } else if(!body.amount){

        return ReE(res, 'Please enter amount.', 422);

    } else if(!body.amountUSD){

        return ReE(res, 'Please enter amount in USD.', 422);

    } else {

        let smsPlanBody = body;
        const planId = smsPlanBody.planId;
        delete smsPlanBody.planId;
        smsPlanBody.update_ip = req.ip;

        [err, smsPlan] = await to(smsService.updateSMSPlan(planId, smsPlanBody));
        if (err) return ReE(res, err, 422);

        if (smsPlan.length === 1 && smsPlan[0] == 1) {

            [err, smsPlanJSON] = await to(smsService.getSMSPlan(planId));
            return ReS(res, 'SMS/Email plan updated successfully.', smsPlanJSON);

        } else {

            return ReE(res, 'Failed to update SMS/Email plan, please try again.', 422);
        }
    }
}

module.exports.deleteSMSPlan = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'SMS/Email id missing.');

    } else {

        [err, smsPlan] = await to(smsService.deleteSMSPlan(req.params.id));
        if (err) return ReE(res, err, 422);
        if (smsPlan.length === 1 && smsPlan[0] == 1) {

            return ReS(res, 'SMS/Email plan deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete sms/email plan. please try again.');
        }
    }
}

// Send SMS Twilio
module.exports.sendTwilioSMS = async function (req, res) {

    const body = req.fields;

    if (!body.description) {

        return ReE(res, 'Please Enter text message', 422);

    } else if (!body.copyNumber) {

        return ReE(res, 'Please enter To_Number.', 422);

    } else {
        const client = require('twilio')(CONFIG.TwilioAccountSid, CONFIG.TwilioAuthToken);

        for(let i = 0; i<body.copyNumber.length; i++){
            client.messages
                .create({body: body.description, from: CONFIG.TwilioNumber, to: body.copyNumber[i]})
                .catch(error => console.log(error));
        }
        return ReS(res,'SMS Sent Successfully');

    }
}
