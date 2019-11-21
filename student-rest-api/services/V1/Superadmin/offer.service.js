const { TOA_offer,TOA_term } = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.addOffer = async function (offerInfo) {

    [err, offer] = await to(TOA_offer.create(offerInfo));
    if (err) TE(err.message);
    return offer;
}

module.exports.updateOffer = async function (offerId, offerInfo) {

    [err, offer] = await to(TOA_offer.update(offerInfo, { where: { offer_id: offerId } }));
    if (err) TE(err.message);
    return offer;
}

module.exports.getOfferList = async function () {

    
    [err, offerList] = await to(TOA_offer.findAll({
        where: { delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['offer_id', 'id'], ['offer_title', 'title'], ['offer_code', 'code'] ,['offer_user', 'users'], ['offer_discount', 'discount'], ['offer_max_amount', 'maxAmount'],'maxDollerAmount' ,['offer_sdate', 'startDate'], ['offer_edate', 'endDate'], 'status'],
        include: [
        {
                model: TOA_term,
                as: 'term',
                attributes: [['term_id', 'id'], ['term_title', 'title']],
        }]
    }));
    if (err) TE(err.message);
    return offerList;

}

module.exports.getOffer = async function (offerId) {

    [err, offer] = await to(TOA_offer.findOne({
        where: { offer_id: offerId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['offer_id', 'id'], ['offer_title', 'title'], ['offer_code', 'code'] ,['offer_user', 'users'], ['offer_discount', 'discount'], ['offer_max_amount', 'maxAmount'], 'maxDollerAmount', ['offer_sdate', 'startDate'], ['offer_edate', 'endDate'], 'status'],
        include: [
            {
                    model: TOA_term,
                    as: 'term',
                    attributes: [['term_id', 'id'], ['term_title', 'title']],
            }]
    }));
    if (err) TE(err.message);
    return offer;

}

module.exports.deleteOffer = async function (offerId) {

    const offerJson = {delete: 1};
    [err, offer] = await to(TOA_offer.update(offerJson, { where: {offer_id: offerId } }));
    if (err) TE(err.message);
    return offer;

}
