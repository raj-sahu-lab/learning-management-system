const { to, ReE, ReS } = require('../../../services/V1/util.service');
const emailService = require('../../../services/V1/Superadmin/email.service');


const addEmailCredit = async function (req, res) {

    let body = req.fields;

    if (!body.accountId) {

        return ReE(res, 'Please Select Institute', 422);

    } else if (!body.totalEmail) {

        return ReE(res, 'Please Enter no. of email.', 422);

    } else {

        let emailInfo = {
            
            account_id: req.user.id,
            institute_id: body.accountId,
            total_email: body.totalEmail,
            create_ip: req.ip
        };

        [err, email] = await to(emailService.addEmailToInstitute(emailInfo));
        if (err) return ReE(res, err, 422);

        if(email){
            
            [err, emailStatus] = await to(emailService.getInstituteRemainEmailStatus(body.accountId));
            return ReS(res, 'Email Credited Successfully.',emailStatus);

        } else {

            return ReE(res, 'Failed to add Email. please try again.', 422);

        }
    }
}
module.exports.addEmailCredit = addEmailCredit;


const getAllEmailCreditList = async function (req, res) {

    if(req.params.id){

        [err, emailSentStatus] = await to(emailService.getInstituteEmailList(req.params.id));
        if (err) return ReE(res, err, 422);
        if(emailSentStatus.length == 0){

            return ReE(res, 'All Institute Email List Get Successfully.', 204);
        }
        else{
            return ReS(res, 'All Institute Email List Get Successfully.',emailSentStatus);
        }

    } else {
    
        [err, emailSentStatus] = await to(emailService.getAllInstituteRemainEmailStatus());
        if (err) return ReE(res, err, 422);

        if(emailSentStatus.length == 0){

            return ReE(res, 'All Institute Email Get Successfully.', 204);
        }
        else{
            return ReS(res, 'All Institute Email Get Successfully.',emailSentStatus);
        }
    }
    
}
module.exports.getAllEmailCreditList = getAllEmailCreditList;


