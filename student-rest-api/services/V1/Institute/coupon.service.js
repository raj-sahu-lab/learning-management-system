const { TOA_coupon,TOA_subject , TOA_currency} = require('../../../models');
const { to, TE } = require('../util.service');

const addCoupon = async function (couponInfo) {

    [err, coupon] = await to(TOA_coupon.create(couponInfo));
    if (err) TE(err.message);
    return coupon;
}
module.exports.addCoupon = addCoupon;

// Update Subject
const updateCoupon = async function (couponId, couponInfo) {

    [err, coupon] = await to(TOA_coupon.update(couponInfo, { where: { coupon_id: couponId } }));
    if (err) TE(err.message);
    return coupon;
}
module.exports.updateCoupon = updateCoupon;

const getCouponList = async function (user) {

    
    [err, couponList] = await to(TOA_coupon.findAll({
        where: { account_id: user.account_id,  delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['coupon_id', 'id'], ['coupon_type','type'],['coupon_title', 'title'], ['coupon_code', 'code'] ,['coupon_user', 'users'], ['coupon_discount', 'discount'], ['coupon_max_amount', 'maxAmount'], ['coupon_min_buy_amount', 'minBuyAmount'], ['coupon_sdate', 'startDate'], ['coupon_edate', 'endDate'], 'status'],
        include: [
            {
                model: TOA_subject,
                as: 'subject',
                attributes: [['subject_id', 'id'], ['subject_title', 'title']],
            },
            {
                model: TOA_currency,
                as: 'currency',
                attributes: ['id', 'title', 'sign', 'code'],
            }
        ]
    }));
    if (err) TE(err.message);
    return couponList;

}
module.exports.getCouponList = getCouponList;


const getCoupon = async function (accountId, couponId) {

    [err, coupon] = await to(TOA_coupon.findOne({
        where: { account_id: accountId, coupon_id: couponId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['coupon_id', 'id'], ['coupon_type','type'],['coupon_title', 'title'], ['coupon_code', 'code'] ,['coupon_user', 'users'], ['coupon_discount', 'discount'], ['coupon_max_amount', 'maxAmount'], ['coupon_min_buy_amount', 'minBuyAmount'], ['coupon_sdate', 'startDate'], ['coupon_edate', 'endDate'], 'status'],
        include: [
        {
            model: TOA_subject,
            as: 'subject',
            attributes: [['subject_id', 'id'], ['subject_title', 'title']],
        },
        {
            model: TOA_currency,
            as: 'currency',
            attributes: ['id', 'title', 'sign', 'code'],
        }
    ]
    }));
    if (err) TE(err.message);
    return coupon;

}
module.exports.getCoupon = getCoupon;

// Delete Subject
const deleteCoupon = async function (accountId, couponId) {

    const couponJson = {delete: 1};
    [err, coupon] = await to(TOA_coupon.update(couponJson, { where: { account_id: accountId, coupon_id: couponId } }));
    if (err) TE(err.message);
    return coupon;

}
module.exports.deleteCoupon = deleteCoupon;