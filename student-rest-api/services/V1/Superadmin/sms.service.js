const { TOA_sms, TOA_sent_sms, TOA_account, TOA_country, TOA_SMS_plans } = require('../../../models');
const { to, TE } = require('../util.service');
const models = require('../../../models');

const addSMSToInstitute = async function (smsInfo) {

    [err, sms] = await to(TOA_sms.create(smsInfo));
    if (err) TE(err.message);

    return sms;
}
module.exports.addSMSToInstitute = addSMSToInstitute;



const getInstituteRemainSMSStatus = async function (instituteId) {

    [err, totalSMS] = await to(TOA_sms.findOne({
        where: { institute_id: instituteId },
        attributes: [[models.sequelize.fn('sum', models.sequelize.col('total_sms')), 'total_sms']],
        include: [{

            model: TOA_account,
            where: { status: 0, delete: 0 },
            as: 'institute',
            attributes: [['account_id', 'id'], ['account_title', 'title']],
        }]
    }));
    if (err) TE(err.message);
    return totalSMS;
}
module.exports.getInstituteRemainSMSStatus = getInstituteRemainSMSStatus;


module.exports.getInstituteSentSMSStatus = async function (instituteId) {

    [err, totalSentSMS] = await to(TOA_sent_sms.findAll({
        where: { account_id: instituteId },
        attributes: [
            'sms_length', 'sent_contacts'
            // [models.sequelize.fn('GROUP_CONCAT', models.sequelize.col('sent_contacts')), 'sent_contacts'], 
            // [models.sequelize.fn('sum', models.sequelize.col('sms_length')), 'total_sms']
        ],
    }));
    if (err) TE(err.message);
    return totalSentSMS;
}

const getAllInstituteRemainSMSStatus = async function (instituteId) {

    [err, totalSMS] = await to(TOA_sms.findAll({
        group: ['institute_id'],
        attributes: [[models.sequelize.fn('sum', models.sequelize.col('total_sms')), 'total_sms']],
        include: [{

            model: TOA_account,
            where: { status: 0, delete: 0 },
            as: 'institute',
            attributes: [['account_id', 'id'], ['account_title', 'title']],
        }]
    }));
    if (err) TE(err.message);
    return totalSMS;
}
module.exports.getAllInstituteRemainSMSStatus = getAllInstituteRemainSMSStatus;

const getInstituteSMSList = async function (instituteId) {

    [err, totalSMS] = await to(TOA_sms.findAll({
        where: { institute_id: instituteId },
        attributes: ['id', ['total_sms', 'sms'], 'createdAt'],
    }));
    if (err) TE(err.message);
    return totalSMS;
}
module.exports.getInstituteSMSList = getInstituteSMSList;



// Manage Plans
module.exports.addSMSPlan = async function (planInfo) {

    [err, smsPlan] = await to(TOA_SMS_plans.create(planInfo));
    if (err) TE(err.message);
    return smsPlan;
}

module.exports.updateSMSPlan = async function (planId, planInfo) {

    [err, smsPlan] = await to(TOA_SMS_plans.update(planInfo, { where: { id: planId } }));
    if (err) TE(err.message);
    return smsPlan;
}

module.exports.getSMSPlanList = async function () {

    [err, smsPlanList] = await to(TOA_SMS_plans.findAll({
        where: { delete: 0 },
        order: [['id', 'DESC']],
        attributes: ['id', 'title', 'planType', 'totalCount', 'amount', 'amountUSD'],
        include: [
            {
                model: TOA_country,
                as: 'country',
                where: { delete: 0, status: 0 },
                attributes: ['id', 'title'],
            }
        ]
    }));
    if (err) TE(err.message);
    return smsPlanList;
}

module.exports.getSMSPlan = async function (planId) {

    [err, smsPlan] = await to(TOA_SMS_plans.findOne({
        where: { id: planId, delete: 0 },
        attributes: ['id', 'title', 'planType', 'totalCount', 'amount', 'amountUSD'],
        include: [
            {
                model: TOA_country,
                as: 'country',
                where: { delete: 0, status: 0 },
                attributes: ['id', 'title'],
            }
        ]
    }));
    if (err) TE(err.message);
    return smsPlan;
}

module.exports.deleteSMSPlan = async function (planId) {

    const smsJson = { delete: 1 };
    [err, smsPlan] = await to(TOA_SMS_plans.update(smsJson, { where: { id: planId } }));
    if (err) TE(err.message);
    return smsPlan;

}


