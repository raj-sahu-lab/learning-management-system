const offerService = require('../../../services/V1/Superadmin/offer.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


module.exports.addOffer = async function (req, res) {

    const body = req.fields;

    if (!body.termId) {

        return ReE(res, 'Please select termId.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.code) {

        return ReE(res, 'Please enter offer code.', 422);

    } else if (!body.noOfUsers) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (body.noOfUsers == 0) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (!body.discount) {

        return ReE(res, 'Please enter discount.', 422);

    } else if (!body.maxAmount) {

        return ReE(res, 'Please enter max offer discount amount.', 422);

    } else if (!body.maxDollerAmount) {

        return ReE(res, 'Please enter max offer discount amount.', 422);

    } else if (!body.startDate) {

        return ReE(res, 'Please select start date.', 422);

    } else if (!body.endtDate) {

        return ReE(res, 'Please select end date.', 422);
    } else {


        let offerBody = {

            account_id: req.user.id,
            term_id: body.termId,
            offer_title: body.title,
            offer_code: body.code,
            offer_user: body.noOfUsers,
            offer_discount: body.discount,
            offer_max_amount: body.maxAmount,
            maxDollerAmount: body.maxDollerAmount,
            offer_sdate: body.startDate,
            offer_edate: body.endtDate,
            create_ip: req.ip,
        };

        [err, offer] = await to(offerService.addOffer(offerBody));
        if (err) return ReE(res, err, 422);

        if (offer) {

            [err, offer] = await to(offerService.getOffer(offer.offer_id));
            if (err) return ReE(res, err, 422);
            return ReS(res, 'Offer added successfully.', offer);

        } else {

            return ReE(res, 'Failed to add offer, please try again.', 422);
        }
    }
}

module.exports.updateOffer = async function (req, res) {

    const body = req.fields;
    if (!body.offerId) {

        return ReE(res, 'Please enter offer id.', 422);

    } else if (!body.termId) {

        return ReE(res, 'Please enter term id.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.code) {

        return ReE(res, 'Please enter offer code.', 422);

    } else if (!body.noOfUsers) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (body.noOfUsers == 0) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (!body.discount) {

        return ReE(res, 'Please enter discount.', 422);

    } else if (!body.maxAmount) {

        return ReE(res, 'Please enter max offer discount amount.', 422);

    } else if (!body.maxDollerAmount) {

        return ReE(res, 'Please enter max offer discount amount.', 422);

    } else if (!body.startDate) {

        return ReE(res, 'Please select start date.', 422);

    } else if (!body.endtDate) {

        return ReE(res, 'Please select end date.', 422);

    } else if (body.status == null) {

        return ReE(res, 'Please select offer status.', 422);

    } else {

        let offerBody = {
            account_id: req.user.id,
            term_id: body.termId,
            offer_title: body.title,
            offer_code: body.code,
            offer_user: body.noOfUsers,
            offer_discount: body.discount,
            offer_max_amount: body.maxAmount,
            maxDollerAmount: body.maxDollerAmount,
            offer_sdate: body.startDate,
            offer_edate: body.endtDate,
            update_ip: req.ip,
            status: body.status
        };

        [err, offer] = await to(offerService.updateOffer(body.offerId, offerBody));
        if (err) return ReE(res, err, 422);

        if (offer.length === 1 && offer[0] == 1) {

            [err, offer] = await to(offerService.getOffer(body.offerId));
            return ReS(res, 'Offer updated successfully.', offer);

        } else {

            return ReE(res, 'Failed to update offer, please try again.', 422);
        }
    }
}

module.exports.getOfferList = async function (req, res) {

    [err, offerList] = await to(offerService.getOfferList());
    if (err) return ReE(res, err, 422);
    
    if (offerList.length == 0) {

        return ReE(res, 'Offers Not Available', 204);

    } else {

        return ReS(res, 'All Offer List Got Successfully.', offerList);
    }


}

module.exports.deleteOffer = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Offer id missing.');

    } else {

        [err, offer] = await to(offerService.deleteOffer( req.params.id));
        if (err) return ReE(res, err, 422);
        if (offer.length === 1 && offer[0] == 1) {

            return ReS(res, 'Offer deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete offer. please try again.');
        }
    }
}
