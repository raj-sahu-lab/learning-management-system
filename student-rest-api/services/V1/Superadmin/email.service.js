const { TOA_email_management, TOA_account , TOA_campaign_sent} = require('../../../models');
const { to, TE } = require('../util.service');
const models = require('../../../models');

const addEmailToInstitute = async function (emailInfo) {

    [err, email] = await to(TOA_email_management.create(emailInfo));
    if (err) TE(err.message);

    return email;
}
module.exports.addEmailToInstitute = addEmailToInstitute;



const getInstituteRemainEmailStatus = async function (instituteId) {

    [err, totalEmail] = await to(TOA_email_management.findOne({
        where: { institute_id: instituteId },
        attributes: [  [models.sequelize.fn('sum' , models.sequelize.col('total_email')) ,'totalEmail']],
        include:[{

            model: TOA_account,
            where: { status: 0, delete :0 },
            as: 'institute',
            attributes: [['account_id','id'], ['account_title','title']],
          }]
    }));
    if(err) TE(err.message);
    return totalEmail;
}
module.exports.getInstituteRemainEmailStatus = getInstituteRemainEmailStatus;


const getInstituteSentEmailStatus = async function (instituteId) {

    [err, totalSentEmail] = await to(TOA_campaign_sent.findOne({
        where: { account_id: instituteId },
        attributes: [ [
            models.sequelize.fn('GROUP_CONCAT' , models.sequelize.col('sent_emails')) ,'sentEmails']
        ],
    }));
    if(err) TE(err.message);
    return totalSentEmail;
}
module.exports.getInstituteSentEmailStatus = getInstituteSentEmailStatus;

const getAllInstituteRemainEmailStatus = async function (instituteId) {

    [err, totalEmail] = await to(TOA_email_management.findAll({
        group: ['institute_id'],
        attributes: [  [models.sequelize.fn('sum' , models.sequelize.col('total_email')) ,'total_email']],
        include:[{

            model: TOA_account,
            where: { status: 0, delete :0 },
            as: 'institute',
            attributes: [['account_id','id'], ['account_title','title']],
          }]
    }));
    if(err) TE(err.message);
    return totalEmail;
}
module.exports.getAllInstituteRemainEmailStatus = getAllInstituteRemainEmailStatus;

const getInstituteEmailList = async function (instituteId) {

    [err, totalEmail] = await to(TOA_email_management.findAll({
        where: { institute_id: instituteId },
        attributes: [ 'id', ['total_email', 'email'] , 'createdAt'],
    }));
    if(err) TE(err.message);
    return totalEmail;
}
module.exports.getInstituteEmailList = getInstituteEmailList;


