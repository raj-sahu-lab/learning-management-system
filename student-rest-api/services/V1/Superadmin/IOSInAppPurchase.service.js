const { TOA_ios_paymentgateway,} = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.addInAppInfo = async function (iosInAppInfo) {

    [err, iosInApp] = await to(TOA_ios_paymentgateway.create(iosInAppInfo));
    if (err) TE(err.message);
    return iosInApp;
}

module.exports.updateInAppInfo = async function (inAppId, iosInAppInfo) {

    [err, iosInApp] = await to(TOA_ios_paymentgateway.update(iosInAppInfo, { where: { id: inAppId } }));
    if (err) TE(err.message);
    return iosInApp;
}

module.exports.getInAppInfoList = async function () {

    
    [err, offerList] = await to(TOA_ios_paymentgateway.findAll({
        where: { delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id' , 'title' , 'inAppId' , 'inAppamount' , 'status'],
    }));
    if (err) TE(err.message);
    return offerList;

}

module.exports.getInAppInfo = async function (inAppId) {

    [err, iosInApp] = await to(TOA_ios_paymentgateway.findOne({
        where: { id: inAppId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: ['id' , 'title' , 'inAppId' , 'inAppamount' , 'status'],
        
    }));
    if (err) TE(err.message);
    return iosInApp;

}



module.exports.deleteInAppInfo = async function (inAppId) {

    const offerJson = {delete: 1};
    [err, iosInApp] = await to(TOA_ios_paymentgateway.update(offerJson, { where: {id: inAppId } }));
    if (err) TE(err.message);
    return iosInApp;

}

module.exports.getInAppInfoListTutor = async function () {

    
    [err, offerList] = await to(TOA_ios_paymentgateway.findAll({
        where: { delete: 0 , status : 0},
        order: [['updatedAt', 'DESC']],
        attributes: ['id' , 'title' , 'inAppId' , 'inAppamount' , 'status'],
    }));
    if (err) TE(err.message);
    return offerList;

} 