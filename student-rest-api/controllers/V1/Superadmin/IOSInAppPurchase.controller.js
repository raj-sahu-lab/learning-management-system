const iosInAppService = require('../../../services/V1/Superadmin/IOSInAppPurchase.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


module.exports.addInAppPurchase = async function (req, res) {

    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.inAppId == null || body.inAppId == "") {

        return ReE(res, 'Please enter in app id from apple store.', 422);

    } else if (body.inAppamount == null) {

        return ReE(res, 'Please enter amount.', 422);

    } else {


        var inAppBody = body;
        inAppBody.create_ip =  req.ip;
        
        [err, inAppPurchase] = await to(iosInAppService.addInAppInfo(inAppBody));
        if (err) return ReE(res, err, 422);

        if (inAppPurchase) {

            [err, inAppInfo] = await to(iosInAppService.getInAppInfo(inAppPurchase.id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'In App Purchase added successfully.', inAppInfo);

        } else {

            return ReE(res, 'Failed to add in app purchase, please try again.', 422);
        }
    }
}

module.exports.updateInAppPurchase = async function (req, res) {

    const body = req.fields;
    if (!body.id) {

        return ReE(res, 'Please select in app id.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (body.inAppId == null || body.inAppId == "") {

        return ReE(res, 'Please enter in app id from apple store.', 422);

    } else if (body.inAppamount == null) {

        return ReE(res, 'Please enter amount.', 422);

    } else if (body.status == null) {

        return ReE(res, 'Please select inapp status.', 422);

    } else {

        const inAppId = body.id;
        delete body.id;
        var inAppBody = body;
        inAppBody.update_ip =  req.ip;
        

        [err, inAppPurchase] = await to(iosInAppService.updateInAppInfo(inAppId, inAppBody));
        if (err) return ReE(res, err, 422);

        if (inAppPurchase.length === 1 && inAppPurchase[0] == 1) {

            [err, inAppPurchase] = await to(iosInAppService.getInAppInfo(inAppId));
            return ReS(res, 'In App Purchase updated successfully.', inAppPurchase);

        } else {

            return ReE(res, 'Failed to update in app purchase, please try again.', 422);
        }
    }
}

module.exports.getInAppPurchaseList = async function (req, res) {

    [err, inAppList] = await to(iosInAppService.getInAppInfoList());
    if (err) return ReE(res, err, 422);

    if (inAppList.length == 0) {

        return ReE(res, 'In App Not Available', 204);

    } else {

        return ReS(res, 'All In App List Got Successfully.', inAppList);
    }

}

module.exports.deleteInAppPurchase = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'In App Purchase id missing.');

    } else {

        [err, inAppPurchase] = await to(iosInAppService.deleteInAppInfo(req.params.id));
        if (err) return ReE(res, err, 422);
        if (inAppPurchase.length === 1 && inAppPurchase[0] == 1) {

            return ReS(res, 'In App Purchase deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete in app purchase. please try again.');
        }
    }
}
