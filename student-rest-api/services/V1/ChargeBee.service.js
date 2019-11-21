const CONFIG = require('../../config/config');
var chargebee = require('chargebee');
const { default: to } = require('await-to-js');
chargebee.configure({site : CONFIG.CHARGEBEE_URL, api_key : CONFIG.CHARGEBEE_API_KEY});

module.exports.GetChargeBeePayURL = async function(chargeBeePlanId){

    [err , hostedPage] = await to(chargebee.hosted_page.checkout_new({ 
        subscription : { 
            plan_id : chargeBeePlanId 
        },
        redirect_url : 'https://tutor.example.com/chargebee',
        cancel_url : 'https://tutor.example.com/chargebee',
    }).request());
    if(err) return err;
    return hostedPage;
}