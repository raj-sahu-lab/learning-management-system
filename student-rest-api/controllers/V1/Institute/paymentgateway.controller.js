const { to, ReE, ReS } = require('../../../services/V1/util.service');
const paymentService = require('../../../services/V1/Institute/payment.service');
const iosInAppService = require('../../../services/V1/Superadmin/IOSInAppPurchase.service');

module.exports.addPaymentGateWay = async function (req, res) {

    const body = req.fields;
    if(!body.title){

        return ReE(res,'Please enter title',422);

    } else if(!body.key){

        return ReE(res,'Please enter key',422);

    } else if(!body.secret){

        return ReE(res,'Please enter secret',422);

    } else {

        const gateWay = {

            account_id: req.user.account_id,
            paymentgateway_title: body.title,
            paymentgateway_authkey: body.key,
            paymentgateway_authsecret: body.secret,
            create_ip: req.ip
        };

        [err, paymentGateWay] = await to(paymentService.addPaymentGateWay(gateWay));
        if (err) return ReE(res, err, 422);
        [err, paymentGateWay] = await to(paymentService.getPaymentGateWay(req.user,paymentGateWay.paymentgateway_id));
        if (err) return ReE(res, err, 422);
        

        return ReS(res, 'Payment GateWay Created Successfully.', paymentGateWay);

    }
}

module.exports.editPaymentGateWay = async function (req, res) {

    const body = req.fields;
    if(!body.id){

        return ReE(res,'Id missing.',422);

    } else if(!body.title) {

        return ReE(res,'Please enter title',422);

    } else if(!body.key){

        return ReE(res,'Please enter key',422);

    } else if(!body.secret){

        return ReE(res,'Please enter secret',422);

    } else if (body.status == null) {

        return ReE(res, 'Please select payment gateway status.', 422);

    } else {

        const gateWay = {

            account_id: req.user.account_id,
            paymentgateway_title: body.title,
            paymentgateway_authkey: body.key,
            paymentgateway_authsecret: body.secret,
            update_ip: req.ip,
            status: body.status
        };

        [err, paymentGateWay] = await to(paymentService.editPaymentGateWay(body.id, gateWay));
        if (err) return ReE(res, err, 422);

        if (paymentGateWay.length === 1) {

            [err, paymentGateWay] = await to(paymentService.getPaymentGateWay(req.user,body.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Payment Gateway updated successfully.', paymentGateWay);

        } else {

            return ReE(res, 'Failed to update payment gateway, please try again.', 422);
        }

    }
}

module.exports.getAllGateWays = async function (req, res) {

    [err, gateWayList] = await to(paymentService.getPaymentGateWatList(req.user));
    if (err) return ReE(res, err, 422);
    
    [err, inAppList] = await to(iosInAppService.getInAppInfoListTutor());
    if (err) return ReE(res, err, 422);

    const gateWays = {gateWay : gateWayList, iOSInApp : inAppList};
    return ReS(res, 'All GateWay Got Successfully.', gateWays);
}

module.exports.getAllGateWaysTitleList = async function (req, res) {

    [err, gateWayTitleList] = await to(paymentService.getPaymentGateWayTitleList());
    if (err) return ReE(res, err, 422);
    return ReS(res, 'All GateWay Title Got Successfully.', gateWayTitleList);
}
