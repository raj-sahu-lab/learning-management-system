const { TOA_feedback } = require('../../../models');
const { to, TE } = require('../util.service');
module.exports.saveFeedback = async function (feedbackJson) {

    [err, requestResult] = await to(TOA_feedback.create(feedbackJson));
    if (err) TE(err.message);
    return requestResult; 

}