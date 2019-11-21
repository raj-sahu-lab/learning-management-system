const { TOA_paymentgateway, TOA_gateway_type } = require('../../../models');
const { to, TE } = require('../util.service');


const addPaymentGateWay = async function (gateWay) {

    [err, paymentGateWay] = await to(TOA_paymentgateway.create(gateWay));
    if (err) TE(err.message);
    return paymentGateWay;

}
module.exports.addPaymentGateWay = addPaymentGateWay;

const getPaymentGateWay = async function (user,paymentgatewayId) {

    [err, paymentGateWay] = await to(TOA_paymentgateway.findOne({
        where: { account_id: user.account_id , paymentgateway_id: paymentgatewayId,delete : 0 },
        attributes: [['paymentgateway_id' ,'id'], ['paymentgateway_title' ,'title'], ['paymentgateway_authkey' , 'key'], ['paymentgateway_authsecret' , 'secret'],'status']
    }));
    if (err) TE(err.message);
    return paymentGateWay;

}
module.exports.getPaymentGateWay = getPaymentGateWay;

const getPaymentGateWatList = async function (user) {

    [err, paymentGateWayList] = await to(TOA_paymentgateway.findAll({
        where: { account_id: user.account_id , delete : 0 },
        attributes: [['paymentgateway_id' ,'id'], ['paymentgateway_title' ,'title'], ['paymentgateway_authkey' , 'key'], ['paymentgateway_authsecret' , 'secret'],'status']
    }));
    if (err) TE(err.message);
    return paymentGateWayList;

}
module.exports.getPaymentGateWatList = getPaymentGateWatList;

const editPaymentGateWay = async function (paymentgatewayId,gateWay) {

    [err, paymentGateWay] = await to(TOA_paymentgateway.update(gateWay, { where: { paymentgateway_id: paymentgatewayId } }));
    if (err) TE(err.message);
    return paymentGateWay;

}
module.exports.editPaymentGateWay = editPaymentGateWay;


const getPaymentGateWayTitleList = async function () {

    [err, PaymentGateWayTitleList] = await to(TOA_gateway_type.findAll({
        where: { delete : 0 , status: 0},
        attributes: ['id' , 'name']
    }));
    if (err) TE(err.message);
    return PaymentGateWayTitleList;

}
module.exports.getPaymentGateWayTitleList = getPaymentGateWayTitleList;