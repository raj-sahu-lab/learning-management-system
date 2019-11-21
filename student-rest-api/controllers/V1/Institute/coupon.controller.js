const couponService = require('../../../services/V1/Institute/coupon.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');


const getCouponList = async function (req, res) {

    [err, couponList] = await to(couponService.getCouponList(req.user));
    if (err) return ReE(res, err, 422);


    if (couponList.length == 0) {

        return ReE(res, 'Coupons Not Available', 204);

    } else {

        return ReS(res, 'All Coupon List Got Successfully.', couponList);
    }


}
module.exports.getCouponList = getCouponList;


const addCoupon = async function (req, res) {

    const body = req.fields;

    if (!body.couponType) {

        return ReE(res, 'Please select coupon type.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.type) {

        return ReE(res, 'Please select type.', 422);

    } else if (!body.typeId) {

        return ReE(res, 'Please select typeId.', 422);

    } else if (!body.code) {

        return ReE(res, 'Please enter coupon code.', 422);

    } else if (!body.noOfUsers) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (body.noOfUsers == 0) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (!body.discount) {

        return ReE(res, 'Please enter discount.', 422);

    } else if (!body.maxAmount) {

        return ReE(res, 'Please enter max coupon discount amount.', 422);

    } else if (!body.minBuyAmount) {

        return ReE(res, 'Please enter min buy amount amount.', 422);

    } else if (!body.startDate) {

        return ReE(res, 'Please select start date.', 422);

    } else if (!body.endtDate) {

        return ReE(res, 'Please select end date.', 422);

    } else {

        let couponBody = {

            account_id: req.user.account_id,
            coupon_type: body.couponType,
            coupon_title: body.title,
            type: body.type,
            type_id: body.typeId,
            coupon_code: body.code,
            coupon_user: body.noOfUsers,
            coupon_discount: body.discount,
            coupon_max_amount: body.maxAmount,
            coupon_min_buy_amount: body.minBuyAmount,
            coupon_sdate: body.startDate,
            coupon_edate: body.endtDate,
            create_ip: req.ip,

        };

        if (body.currencyId) {

            couponBody.currencyId = body.currencyId;
        }

        [err, coupon] = await to(couponService.addCoupon(couponBody));
        if (err) return ReE(res, err, 422);

        if (coupon) {

            [err, coupon] = await to(couponService.getCoupon(req.user.account_id, coupon.coupon_id));
            
            return ReS(res, 'Coupon added successfully.', coupon);

        } else {

            return ReE(res, 'Failed to add coupon, please try again.', 422);
        }
    }
}
module.exports.addCoupon = addCoupon;

const updateCoupon = async function (req, res) {

    const body = req.fields;

    if (!body.couponId) {

        return ReE(res, 'Please enter coupon id.', 422);

    } else if (!body.couponType) {

        return ReE(res, 'Please select coupon type.', 422);

    } else if (!body.type) {

        return ReE(res, 'Please select type.', 422);

    } else if (!body.typeId) {

        return ReE(res, 'Please select typeId.', 422);

    } else if (!body.title) {

        return ReE(res, 'Please enter title.', 422);

    } else if (!body.code) {

        return ReE(res, 'Please enter coupon code.', 422);

    } else if (!body.noOfUsers) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (body.noOfUsers == 0) {

        return ReE(res, 'Please enter no. of users.', 422);

    } else if (!body.discount) {

        return ReE(res, 'Please enter discount.', 422);

    } else if (!body.maxAmount) {

        return ReE(res, 'Please enter max coupon discount amount.', 422);

    } else if (!body.minBuyAmount) {

        return ReE(res, 'Please enter min buy amount amount.', 422);

    } else if (!body.startDate) {

        return ReE(res, 'Please select start date.', 422);

    } else if (!body.endtDate) {

        return ReE(res, 'Please select end date.', 422);

    } else if (body.status == null) {

        return ReE(res, 'Please select subject status.', 422);

    } else {

        let couponBody = {

            coupon_type: body.couponType,
            type: body.type,
            type_id: body.typeId,
            coupon_title: body.title,
            coupon_code: body.code,
            coupon_user: body.noOfUsers,
            coupon_discount: body.discount,
            coupon_max_amount: body.maxAmount,
            coupon_min_buy_amount: body.minBuyAmount,
            coupon_sdate: body.startDate,
            coupon_edate: body.endtDate,
            update_ip: req.ip,
            status: body.status,

        };

        if (body.currencyId) {

            couponBody.currencyId = body.currencyId;
        }

        [err, coupon] = await to(couponService.updateCoupon(body.couponId, couponBody));
        if (err) return ReE(res, err, 422);

        if (coupon.length === 1 && coupon[0] == 1) {

            [err, coupon] = await to(couponService.getCoupon(req.user.account_id, body.couponId));
            return ReS(res, 'Coupon updated successfully.', coupon);

        } else {

            return ReE(res, 'Failed to update coupon, please try again.', 422);
        }
    }
}
module.exports.updateCoupon = updateCoupon;



const deleteCoupon = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Coupon id missing.');

    } else {

        [err, coupon] = await to(couponService.deleteCoupon(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);
        if (coupon.length === 1 && coupon[0] == 1) {

            return ReS(res, 'Coupon deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete coupon. please try again.');
        }
    }
}
module.exports.deleteCoupon = deleteCoupon;