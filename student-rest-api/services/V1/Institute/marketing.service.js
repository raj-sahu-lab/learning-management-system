const { TOA_sent_sms , TOA_campaign_sent} = require('../../../models');
const { to, TE } = require('../util.service');


// Add New SMS
const addSMS = async function (smsInfo) {
    
    [err, sms] = await to(TOA_sent_sms.create(smsInfo));    
    if (err) TE(err.message);
    return sms;
}
module.exports.addSMS = addSMS;


module.exports.addCampaignEmail = async function (campaignEmail) {
    
    [err, emailCampaign] = await to(TOA_campaign_sent.create(campaignEmail));    
    if (err) TE(err.message);
    return emailCampaign;
};

module.exports.getCampaign = async function (accountId, campaignId) {

    [err, emailCampaign] = await to(TOA_campaign_sent.findOne({

        where: { account_id: accountId,  id: campaignId },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'campaign_id','title', 'subject', 'content', 'sent_emails'],
    }));    
    if (err) TE(err.message);
    return emailCampaign;
}



module.exports.getAllCampaignList = async function (accountId) {

    [err, emailCampaignList] = await to(TOA_campaign_sent.findAll({

        where: { account_id: accountId },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'campaign_id','title', 'subject', 'content', 'sent_emails'],
    }));    
    if (err) TE(err.message);
    return emailCampaignList;
}